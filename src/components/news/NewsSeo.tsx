import { Head } from 'vike-react/Head';
import { absoluteNewsUrl, SITE_URL } from '../../lib/news/site';
import type { NewsArticle } from '../../lib/news/types';
import { NewsClientHead } from './NewsClientHead';

const portalTitle = 'Nutriwork Notícias | Nutrição baseada em evidências';
const portalDescription = 'Explicadores, análises e atualizações do Nutriwork para estudar Nutrição com leitura crítica e clareza.';
const portalImageUrl = `${SITE_URL}/assets/og-nutriwork.jpg`;

export function NewsIndexHead() {
  const canonicalUrl = absoluteNewsUrl('/noticias');

  return (
    <>
      <NewsClientHead title={portalTitle} description={portalDescription} canonicalUrl={canonicalUrl} imageUrl={portalImageUrl} openGraphType="website" />
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:title" content={portalTitle} />
        <meta name="twitter:description" content={portalDescription} />
        <meta name="twitter:image" content={portalImageUrl} />
      </Head>
    </>
  );
}

export function ArticleHead({ article }: { article: NewsArticle }) {
  const canonicalUrl = absoluteNewsUrl(`/noticias/${article.slug}`);
  const imageUrl = absoluteNewsUrl(article.coverImage);
  const title = `${article.title} | Nutriwork Notícias`;
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': article.type === 'noticia' ? 'NewsArticle' : 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    headline: article.title,
    description: article.summary,
    image: [imageUrl],
    author: {
      '@type': 'Organization',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nutriwork',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/assets/favicon-nutriwork.png`
      }
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt
  }).replace(/</g, '\\u003c');

  return (
    <>
      <NewsClientHead
        title={title}
        description={article.summary}
        canonicalUrl={canonicalUrl}
        imageUrl={imageUrl}
        openGraphType="article"
        article={{
          publishedAt: article.publishedAt,
          modifiedAt: article.updatedAt ?? article.publishedAt,
          author: article.author,
          structuredData
        }}
      />
      <Head>
        <meta name="description" content={article.summary} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={article.summary} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.summary} />
        <meta name="twitter:image" content={imageUrl} />
        <meta property="article:published_time" content={article.publishedAt} />
        <meta property="article:modified_time" content={article.updatedAt ?? article.publishedAt} />
        <meta property="article:author" content={article.author} />
        <script id="news-article-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
      </Head>
    </>
  );
}
