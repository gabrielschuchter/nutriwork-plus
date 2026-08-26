import { formatNewsDate, getEventDetailsLabel, getReadingTimeLabel } from '../../lib/news/format';
import type { NewsArticle } from '../../lib/news/types';

type NewsCardProps = {
  article: NewsArticle;
  featured?: boolean;
};

export function NewsCard({ article, featured = false }: NewsCardProps) {
  const Heading = featured ? 'h2' : 'h3';
  const eventDetails = getEventDetailsLabel(article);

  return (
    <article className={`news-card ${featured ? 'news-card--featured' : ''}`}>
      <a className="news-card__link" href={`/noticias/${article.slug}`} aria-label={`Ler: ${article.title}`}>
        <div className="news-card__cover">
          <img src={article.coverImage} alt={article.coverAlt} loading={featured ? 'eager' : 'lazy'} width="760" height="500" />
        </div>
        <div className="news-card__content">
          <Heading>{article.title}</Heading>
          <p>{article.summary}</p>
          {eventDetails && <p className="news-card__event"><span>{article.type === 'evento' ? 'Ao vivo' : 'Agenda'}</span>{eventDetails}</p>}
          <div className="news-card__meta">
            <span>{article.author}</span>
            <span aria-hidden="true">•</span>
            <time dateTime={article.publishedAt}>{formatNewsDate(article.publishedAt)}</time>
            <span aria-hidden="true">•</span>
            <span>{getReadingTimeLabel(article)}</span>
          </div>
        </div>
      </a>
    </article>
  );
}
