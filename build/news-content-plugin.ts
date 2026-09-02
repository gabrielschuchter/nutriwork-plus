import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import type { Plugin } from 'vite';
import { z } from 'zod';
import { NEWS_CATEGORIES, NEWS_TYPES } from '../src/lib/news/constants';
import type { NewsArticle } from '../src/lib/news/types';

const virtualModuleId = 'virtual:nutriwork-news';
const resolvedVirtualModuleId = `\0${virtualModuleId}`;
const siteUrl = 'https://gruponutriwork.com.br';
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const contentDirectory = path.join(projectRoot, 'content', 'noticias');
const publicDirectory = path.join(projectRoot, 'public');

const dateSchema = z.preprocess(
  (value) => value instanceof Date ? value.toISOString().slice(0, 10) : value,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a date in YYYY-MM-DD format.')
);

const optionalDateSchema = z.preprocess(
  (value) => value === '' || value === null ? undefined : value,
  dateSchema.optional()
);

const optionalTimeSchema = z.preprocess(
  (value) => value === '' || value === null ? undefined : value,
  z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use a time in HH:MM format.').optional()
);

const optionalLocationSchema = z.preprocess(
  (value) => value === '' || value === null ? undefined : value,
  z.string().trim().min(3).max(120).optional()
);

const callToActionUrlSchema = z.string().trim().refine(
  (value) => (value.startsWith('/') && !value.startsWith('//')) || /^https?:\/\/\S+$/i.test(value),
  'Use an http(s) URL or an internal path starting with /.'
);

const callToActionSchema = z.preprocess(
  (value) => {
    if (value === null) return undefined;
    if (value && typeof value === 'object' && Object.values(value).every((item) => item === '' || item === undefined || item === null)) {
      return undefined;
    }
    return value;
  },
  z.object({
    label: z.string().trim().min(2).max(80),
    url: callToActionUrlSchema
  }).optional()
);

const contentDaySchema = z.object({
  module: z.string().trim().min(3).max(160),
  presenter: z.string().trim().min(3).max(120),
  presenterHandle: z.string().trim().regex(/^@[a-z0-9._]+$/i, 'Use um perfil iniciado por @.'),
  presenterUrl: callToActionUrlSchema
});

const articleSchema = z.object({
  title: z.string().trim().min(8),
  summary: z.string().trim().min(24),
  type: z.enum(NEWS_TYPES),
  category: z.enum(NEWS_CATEGORIES),
  tags: z.array(z.string().trim().min(2)).min(1),
  author: z.string().trim().min(3),
  publishedAt: dateSchema,
  updatedAt: optionalDateSchema,
  coverImage: z.string().trim().startsWith('/'),
  coverAlt: z.string().trim().min(8),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  contentDay: contentDaySchema.optional(),
  callToAction: callToActionSchema,
  eventDate: optionalDateSchema,
  eventTime: optionalTimeSchema,
  eventLocation: optionalLocationSchema,
  references: z.array(z.object({
    citation: z.string().trim().min(4),
    url: z.string().url()
  })).default([])
}).superRefine((article, context) => {
  if (article.type === 'evento' && !article.eventDate) {
    context.addIssue({ code: 'custom', path: ['eventDate'], message: 'Events require eventDate.' });
  }
  if ((article.eventTime || article.eventLocation) && !article.eventDate) {
    context.addIssue({ code: 'custom', path: ['eventDate'], message: 'eventDate is required when eventTime or eventLocation is filled.' });
  }
  if (article.type === 'conteudo-do-dia' && !article.contentDay) {
    context.addIssue({ code: 'custom', path: ['contentDay'], message: 'Conteúdo do dia requires module and presenter details.' });
  }
});

function isInsideDirectory(candidate: string, directory: string) {
  const relativePath = path.relative(directory, candidate);
  return relativePath !== '' && !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
}

function getPlainText(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[`*_~>#|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getReadingTimeMinutes(plainText: string) {
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function validateCoverImage(coverImage: string, filePath: string) {
  const assetPath = path.resolve(publicDirectory, coverImage.slice(1));
  if (!isInsideDirectory(assetPath, publicDirectory) || !fs.existsSync(assetPath)) {
    throw new Error(`${filePath}: coverImage \"${coverImage}\" does not exist in public/.`);
  }
}

function loadArticles() {
  if (!fs.existsSync(contentDirectory)) return [] as NewsArticle[];

  const articlePaths = fs.readdirSync(contentDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => path.join(contentDirectory, entry.name))
    .sort((left, right) => left.localeCompare(right));

  const slugs = new Set<string>();

  return articlePaths.map((filePath) => {
    const slug = path.basename(filePath, '.md');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      throw new Error(`${filePath}: filename must be a lowercase kebab-case slug.`);
    }
    if (slugs.has(slug)) {
      throw new Error(`${filePath}: duplicate slug \"${slug}\".`);
    }
    slugs.add(slug);

    const source = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(source);
    const result = articleSchema.safeParse(parsed.data);
    if (!result.success) {
      const issues = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
      throw new Error(`${filePath}: invalid frontmatter. ${issues}`);
    }
    if (!parsed.content.trim()) {
      throw new Error(`${filePath}: Markdown body cannot be empty.`);
    }

    validateCoverImage(result.data.coverImage, filePath);
    const plainText = getPlainText(parsed.content);

    return {
      ...result.data,
      slug,
      tags: [...new Set(result.data.tags.map((tag) => tag.trim()))],
      references: result.data.references,
      content: parsed.content.trim(),
      plainText,
      readingTimeMinutes: getReadingTimeMinutes(plainText)
    } satisfies NewsArticle;
  });
}

function createSitemap(articles: NewsArticle[]) {
  const publicArticles = articles.filter((article) => !article.draft);
  const urls = [
    { path: '/', lastmod: undefined },
    { path: '/noticias', lastmod: undefined },
    ...publicArticles.map((article) => ({
      path: `/noticias/${article.slug}`,
      lastmod: article.updatedAt ?? article.publishedAt
    }))
  ];

  const entries = urls.map(({ path: urlPath, lastmod }) => `  <url>\n    <loc>${siteUrl}${urlPath}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`);
  return `<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n${entries.join('\n')}\n</urlset>\n`;
}

export function newsContentPlugin(): Plugin {
  let articles = loadArticles();

  return {
    name: 'nutriwork-news-content',
    enforce: 'pre',
    resolveId(id) {
      return id === virtualModuleId ? resolvedVirtualModuleId : undefined;
    },
    load(id) {
      if (id !== resolvedVirtualModuleId) return undefined;
      // Drafts are still parsed and validated during the build, but must never
      // be serialized into the browser bundle.
      const publicArticles = articles.filter((article) => !article.draft);
      return `export const articles = ${JSON.stringify(publicArticles)};`;
    },
    buildStart() {
      articles = loadArticles();
      this.addWatchFile(contentDirectory);
    },
    handleHotUpdate(context) {
      if (!context.file.startsWith(contentDirectory)) return undefined;
      articles = loadArticles();
      const module = context.server.moduleGraph.getModuleById(resolvedVirtualModuleId);
      return module ? [module] : [];
    },
    generateBundle(options) {
      const normalizedOutputDirectory = (options.dir ?? '').replace(/\\/g, '/');
      if (!normalizedOutputDirectory.endsWith('/dist/client')) return;
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: createSitemap(articles)
      });
    }
  };
}
