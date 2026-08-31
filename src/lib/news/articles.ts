import { articles } from 'virtual:nutriwork-news';
import type { NewsArticle, NewsCallToAction } from './types';

const contentDayCallToAction: NewsCallToAction = {
  label: 'Conhecer o Nutriwork+',
  url: '/#planos'
};

function compareByPublicationDate(left: NewsArticle, right: NewsArticle) {
  return right.publishedAt.localeCompare(left.publishedAt) || right.slug.localeCompare(left.slug);
}

export const publicArticles: NewsArticle[] = articles
  .filter((article) => !article.draft)
  .sort(compareByPublicationDate);

export const featuredArticle = publicArticles
  .filter((article) => article.featured)
  .sort((left, right) => Number(right.type === 'evento') - Number(left.type === 'evento') || compareByPublicationDate(left, right))[0]
  ?? publicArticles[0];

export function getArticleBySlug(slug: string | undefined) {
  return publicArticles.find((article) => article.slug === slug);
}

export function getArticleCallToAction(article: NewsArticle) {
  return article.callToAction ?? (article.type === 'conteudo-do-dia' ? contentDayCallToAction : undefined);
}

export function getRelatedArticles(article: NewsArticle, limit = 3) {
  return publicArticles
    .filter((candidate) => candidate.slug !== article.slug)
    .map((candidate) => ({
      article: candidate,
      score: (candidate.category === article.category ? 4 : 0)
        + candidate.tags.filter((tag) => article.tags.includes(tag)).length
    }))
    .sort((left, right) => right.score - left.score || compareByPublicationDate(left.article, right.article))
    .slice(0, limit)
    .map(({ article: relatedArticle }) => relatedArticle);
}
