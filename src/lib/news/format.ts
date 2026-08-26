import type { NewsArticle } from './types';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'long',
  year: 'numeric'
});

export function formatNewsDate(value: string) {
  return dateFormatter.format(new Date(`${value}T12:00:00Z`));
}

export function getReadingTimeLabel(article: NewsArticle) {
  return `${article.readingTimeMinutes} min de leitura`;
}

export function getEventDetailsLabel(article: NewsArticle) {
  if (!article.eventDate) return undefined;

  const details = [formatNewsDate(article.eventDate)];
  if (article.eventTime) details.push(`às ${article.eventTime}`);
  if (article.eventLocation) details.push(article.eventLocation);
  return details.join(' · ');
}
