import { usePageContext } from 'vike-react/usePageContext';
import { Head } from 'vike-react/Head';
import { NEWS_CATEGORY_LABELS } from '../../lib/news/constants';
import { getArticleBySlug, getRelatedArticles } from '../../lib/news/articles';
import { formatNewsDate, getEventDetailsLabel, getReadingTimeLabel } from '../../lib/news/format';
import { MarkdownArticle } from './MarkdownArticle';
import { NewsCard } from './NewsCard';
import { NewsFooter } from './NewsFooter';
import { NewsHeader } from './NewsHeader';
import { ArticleHead } from './NewsSeo';
import { ShareActions } from './ShareActions';
import { NewsClientHead } from './NewsClientHead';
import { absoluteNewsUrl, SITE_URL } from '../../lib/news/site';

function ArticleNotFound() {
  return (
    <div className="news-page">
      <NewsClientHead
        title="Publicação não encontrada | Nutriwork Notícias"
        description="Esta publicação não está disponível no Nutriwork Notícias."
        canonicalUrl={absoluteNewsUrl('/noticias')}
        imageUrl={`${SITE_URL}/assets/og-nutriwork.jpg`}
        openGraphType="website"
        robots="noindex, follow"
      />
      <Head>
        <title>Publicação não encontrada | Nutriwork Notícias</title>
        <meta name="description" content="Esta publicação não está disponível no Nutriwork Notícias." />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <NewsHeader />
      <main id="conteudo-principal" className="news-main news-not-found">
        <div className="page-width">
          <p className="news-eyebrow">404</p>
          <h1>Esta publicação não está disponível.</h1>
          <p>Ela pode ter sido movida, permanecer como rascunho ou não existir.</p>
          <a className="button button--primary" href="/noticias">Voltar para Notícias</a>
        </div>
      </main>
      <NewsFooter />
    </div>
  );
}

export function NewsArticlePage() {
  const pageContext = usePageContext();
  const article = getArticleBySlug(pageContext.routeParams.slug);

  if (!article) return <ArticleNotFound />;

  const relatedArticles = getRelatedArticles(article);
  const eventDetails = getEventDetailsLabel(article);
  const callToActionIsExternal = article.callToAction?.url.startsWith('http');

  return (
    <div className="news-page">
      <ArticleHead article={article} />
      <a className="skip-link" href="#conteudo-principal">Pular para o conteúdo</a>
      <NewsHeader />
      <main id="conteudo-principal" className="news-main news-article-page">
        <article>
          <header className="news-article-hero">
            <div className="page-width page-width--narrow">
              <nav className="news-breadcrumb" aria-label="Caminho de navegação">
                <a href="/noticias">Notícias</a>
                <span aria-hidden="true">/</span>
                <span aria-current="page">{NEWS_CATEGORY_LABELS[article.category]}</span>
              </nav>
              {eventDetails && <p className="news-event-details"><span>{article.type === 'evento' ? 'Evento ao vivo' : 'Agenda Nutriwork'}</span>{eventDetails}</p>}
              <h1>{article.title}</h1>
              <p className="news-article-hero__summary">{article.summary}</p>
              <div className="news-article-hero__meta">
                <span>Por {article.author}</span>
                <span aria-hidden="true">•</span>
                <time dateTime={article.publishedAt}>Publicado em {formatNewsDate(article.publishedAt)}</time>
                {article.updatedAt && <><span aria-hidden="true">•</span><time dateTime={article.updatedAt}>Atualizado em {formatNewsDate(article.updatedAt)}</time></>}
                <span aria-hidden="true">•</span>
                <span>{getReadingTimeLabel(article)}</span>
              </div>
            </div>
          </header>

          <div className="page-width page-width--narrow">
            <figure className="news-article-cover">
              <img src={article.coverImage} alt={article.coverAlt} width="1440" height="810" />
            </figure>
            <div className="news-article-layout">
              <ShareActions slug={article.slug} title={article.title} summary={article.summary} />
              <MarkdownArticle content={article.content} />
            </div>

            {article.references.length > 0 && (
              <section className="news-references" aria-labelledby="references-title">
                <p className="news-eyebrow">Referências</p>
                <h2 id="references-title">Para aprofundar a leitura</h2>
                <ol>
                  {article.references.map((reference) => <li key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer">{reference.citation}</a></li>)}
                </ol>
              </section>
            )}

            {article.callToAction && (
              <aside className="news-cta news-cta--editorial" aria-label="Próximo passo desta publicação">
                <div>
                  <p>Próximo passo</p>
                  <h2>Entre no grupo para acompanhar a aula ao vivo.</h2>
                </div>
                <a className="button button--primary" href={article.callToAction.url} target={callToActionIsExternal ? '_blank' : undefined} rel={callToActionIsExternal ? 'noreferrer' : undefined}>{article.callToAction.label}</a>
              </aside>
            )}

          </div>
        </article>

        {relatedArticles.length > 0 && (
          <section className="news-related" aria-labelledby="related-title">
            <div className="page-width">
              <div className="news-section-heading">
                <p>Continue por aqui</p>
                <h2 id="related-title">Publicações relacionadas</h2>
              </div>
              <div className="news-grid">
                {relatedArticles.map((relatedArticle) => <NewsCard key={relatedArticle.slug} article={relatedArticle} />)}
              </div>
            </div>
          </section>
        )}
      </main>
      <NewsFooter />
    </div>
  );
}
