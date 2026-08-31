import type { NewsContentDay } from '../../lib/news/types';

export function NewsContentDayDetails({ details }: { details: NewsContentDay }) {
  return (
    <div className="news-content-day-details">
      <p>Aula do módulo <strong>{details.module}</strong></p>
      <p>🎥 Ministrada pela <a href={details.presenterUrl} target="_blank" rel="noreferrer">{details.presenterHandle}</a></p>
    </div>
  );
}
