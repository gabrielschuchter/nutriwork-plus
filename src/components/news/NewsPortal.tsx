import { useEffect, useState } from 'react';
import { featuredArticle } from '../../lib/news/articles';
import { NewsCard } from './NewsCard';
import { NewsFooter } from './NewsFooter';
import { NewsHeader } from './NewsHeader';
import { NewsIndexHead } from './NewsSeo';

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

export function NewsPortal() {
  const [loading, setLoading] = useState(true);

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
            {featuredArticle && (
              <section className="news-featured" aria-labelledby="news-featured-title">
                <div className="news-section-heading">
                  <p>Em destaque</p>
                  <h2 id="news-featured-title">O que está acontecendo agora</h2>
                </div>
                <NewsCard article={featuredArticle} featured />
              </section>
            )}

          </div>
        </section>
      </main>
      <NewsFooter />
    </div>
  );
}
