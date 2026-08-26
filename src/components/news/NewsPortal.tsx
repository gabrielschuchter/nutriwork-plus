import { useEffect, useMemo, useState } from 'react';
import { NEWS_CATEGORIES, NEWS_CATEGORY_LABELS } from '../../lib/news/constants';
import { createNewsSearch, searchNews } from '../../lib/news/search';
import type { NewsArticle } from '../../lib/news/types';
import { featuredArticle, publicArticles } from '../../lib/news/articles';
import { NewsCard } from './NewsCard';
import { NewsFooter } from './NewsFooter';
import { NewsHeader } from './NewsHeader';
import { NewsIndexHead } from './NewsSeo';

type CategoryFilter = 'all' | typeof NEWS_CATEGORIES[number];

function NewsLoader({ active }: { active: boolean }) {
  return (
    <div className={`loading-experience loading-experience--return ${active ? 'loading-experience--active loading-experience--animating' : ''}`} aria-hidden="true">
      <div className="loading-experience__ambient" />
      <div className="loading-experience__brand">
        <div className="loading-experience__mark">N<span>+</span></div>
        <div className="loading-experience__process loading-experience__process--compact">
          <svg className="nw-spinner" viewBox="25 25 50 50" aria-hidden="true">
            <circle className="nw-spinner__track" cx="50" cy="50" r="20" />
            <circle className="nw-spinner__arc" cx="50" cy="50" r="20" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function filterByCategory(articles: NewsArticle[], category: CategoryFilter) {
  return category === 'all' ? articles : articles.filter((article) => article.category === category);
}

export function NewsPortal() {
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const search = useMemo(() => createNewsSearch(publicArticles), []);
  const availableCategories = useMemo(
    () => NEWS_CATEGORIES.filter((candidate) => publicArticles.some((article) => article.category === candidate)),
    []
  );
  const matchingSlugs = useMemo(() => searchNews(search, query), [query, search]);
  const isDiscoveryMode = !query.trim() && category === 'all';
  const results = useMemo(() => {
    const categoryMatches = filterByCategory(publicArticles, category);
    if (!query.trim()) return categoryMatches;

    const articlesBySlug = new Map(categoryMatches.map((article) => [article.slug, article]));
    return matchingSlugs.flatMap((slug) => {
      const article = articlesBySlug.get(slug);
      return article ? [article] : [];
    });
  }, [category, matchingSlugs, query]);
  const gridArticles = isDiscoveryMode && featuredArticle
    ? results.filter((article) => article.slug !== featuredArticle.slug)
    : results;
  const hasActiveFilter = Boolean(query.trim()) || category !== 'all';

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
  };

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="news-page">
      <NewsLoader active={loading} />
      <NewsIndexHead />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <NewsHeader />
      <main id="conteudo-principal" className="news-main">
        <section className="news-hero" aria-labelledby="news-title">
          <div className="page-width">
            <h1 id="news-title">Nutriwork Notícias</h1>
            <p className="news-hero__copy">Notícias, conteúdos e atualizações sobre ciência, carreira, Nutrição e tudo o que acontece no universo Nutriwork.</p>
          </div>
        </section>

        <section className="news-discovery" aria-labelledby="news-discovery-title">
          <div className="page-width">
            <div className="news-toolbar">
              <div className="news-search">
                <label htmlFor="news-search-input">Pesquisar publicações</label>
                <div className="news-search__control">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></svg>
                  <input id="news-search-input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex.: intervalo, cognição, causalidade" autoComplete="off" />
                  {query && <button type="button" className="news-search__clear" onClick={() => setQuery('')} aria-label="Limpar busca">Limpar</button>}
                </div>
              </div>
              <div className="news-filters" aria-label="Filtrar publicações por categoria">
                <span className="news-filters__label">Categoria</span>
                <div className="news-filters__options">
                  <button type="button" className={category === 'all' ? 'is-selected' : undefined} aria-pressed={category === 'all'} onClick={() => setCategory('all')}>Todas</button>
                  {availableCategories.map((candidate) => <button key={candidate} type="button" className={category === candidate ? 'is-selected' : undefined} aria-pressed={category === candidate} onClick={() => setCategory(candidate)}>{NEWS_CATEGORY_LABELS[candidate]}</button>)}
                </div>
              </div>
            </div>
            <p className="news-results-count" aria-live="polite" aria-atomic="true">{results.length === 1 ? '1 publicação encontrada' : `${results.length} publicações encontradas`}</p>

            {isDiscoveryMode && featuredArticle && (
              <section className="news-featured" aria-labelledby="news-featured-title">
                <div className="news-section-heading">
                  <p>Em destaque</p>
                  <h2 id="news-featured-title">O que está acontecendo agora</h2>
                </div>
                <NewsCard article={featuredArticle} featured />
              </section>
            )}

            <section className="news-listing" aria-labelledby="news-discovery-title">
              <div className="news-section-heading">
                <p>{hasActiveFilter ? 'Resultado da busca' : 'Do noticiário'}</p>
                <h2 id="news-discovery-title">{hasActiveFilter ? 'Encontre uma notícia' : 'Mais notícias para acompanhar'}</h2>
              </div>
              {gridArticles.length > 0 ? (
                <div className="news-grid">
                  {gridArticles.map((article) => <NewsCard key={article.slug} article={article} />)}
                </div>
              ) : (
                <div className="news-empty" role="status">
                  <p>{publicArticles.length === 0 ? 'Ainda não há publicações públicas.' : 'Nenhuma publicação corresponde a essa busca e filtro.'}</p>
                  {hasActiveFilter && <button type="button" onClick={clearFilters}>Limpar busca e filtros</button>}
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
      <NewsFooter />
    </div>
  );
}
