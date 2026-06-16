import { useState } from 'react';
import './PlatformPreview.css';

/**
 * Prévia da área de membros do Nutriwork Plus exibida no monitor da Home.
 * Reconstrói, de forma fiel à plataforma real, a navegação por sidebar e as
 * telas internas (Home, Continuar assistindo, Grupo de Estudos / módulos,
 * detalhe de módulo, podcasts e suporte), com transições suaves de navegação.
 *
 * Componente isolado e reutilizável: dimensiona-se proporcionalmente ao
 * container (container queries), sem valores fixos dependentes de breakpoint.
 */

type View = 'home' | 'continuar' | 'grupo' | 'modulo' | 'podcasts' | 'suporte';

const navItems: Array<{ id: Exclude<View, 'modulo' | 'podcasts'>; label: string; icon: IconName }> = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'continuar', label: 'Continuar assistindo', icon: 'play' },
  { id: 'grupo', label: 'Grupo de Estudos', icon: 'layers' },
  { id: 'suporte', label: 'Suporte', icon: 'support' },
];

const continueWatching = [
  { title: 'Sarcopenia — panorama geral', module: 'Fisiologia humana', progress: 62 },
  { title: 'Introdução à neurociências', module: 'Bioquímica da nutrição', progress: 38 },
  { title: 'Potenciais de membrana e ação', module: 'Bioquímica da nutrição', progress: 21 },
];

const modules = [
  { id: 'intro', title: 'Introdução à Nutrição', tag: 'Trilha inicial', lessons: 8 },
  { id: 'evidence', title: 'Nutrição Baseada em Evidências', tag: 'Essencial', lessons: 12 },
  { id: 'clinical', title: 'Nutrição Clínica', tag: 'Prática clínica', lessons: 10 },
  { id: 'sports', title: 'Nutrição Esportiva', tag: 'Performance', lessons: 9 },
  { id: 'behavior', title: 'Nutrição Comportamental', tag: 'Comportamento', lessons: 7 },
  { id: 'biochem', title: 'Bioquímica da Nutrição', tag: 'Fundamentos', lessons: 11 },
];

const extras = ['Tipos de estudos', 'Proteínas — visão bioquímica', 'E-book exclusivo'];

const podcasts = [
  { n: '#01', guest: 'Victor Pimenta', title: 'Ninguém me avisou que seria assim' },
  { n: '#02', guest: 'Equipe Nutriwork', title: 'Tô cansado e não posso parar' },
  { n: '#03', guest: 'Juan Cardoso', title: 'Estudar não é só estudar e ler' },
  { n: '#04', guest: 'Thales Faccin', title: 'Trabalho, networking e portas que se abrem' },
  { n: '#05', guest: 'Mentaliza', title: 'Organização e planejamento' },
  { n: '#06', guest: 'Guilherme Moreira', title: 'Relaxamento muscular progressivo' },
];

const moduleLessons = [
  { title: 'Bem-vindo ao Nutriwork+', note: 'olá, se você chegou até aqui', length: '0 min' },
  { title: 'O que você encontrará?', note: 'visão geral da plataforma', length: '1 min' },
  { title: 'Como aproveitar sua trilha', note: 'método de estudos aplicado', length: '3 min' },
];

type IconName = 'home' | 'play' | 'layers' | 'support' | 'instagram' | 'mic' | 'arrow' | 'clock' | 'check';

function PreviewIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, JSX.Element> = {
    home: <><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1Z" /></>,
    play: <><circle cx="12" cy="12" r="9" /><path d="m10 9 5 3-5 3V9Z" /></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></>,
    support: <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="3" /><path d="m6 6 3.5 3.5M18 6l-3.5 3.5M6 18l3.5-3.5M18 18l-3.5-3.5" /></>,
    instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.2 6.8h.01" /></>,
    mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7" /></>,
    arrow: <><path d="m9 6 6 6-6 6" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
    check: <><path d="m4 12 5 5L20 6" /></>,
  };
  return (
    <svg className="pp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export default function PlatformPreview() {
  const [view, setView] = useState<View>('home');
  const [activeModule, setActiveModule] = useState(modules[1]);

  const openModule = (module: typeof modules[number]) => {
    setActiveModule(module);
    setView('modulo');
  };

  const currentNav = view === 'modulo' ? 'grupo' : view === 'podcasts' ? 'home' : view;

  return (
    <div className="platform-preview" role="group" aria-label="Prévia da área de membros do Nutriwork Plus">
      <aside className="pp-sidebar">
        <div className="pp-brand">
          <span className="pp-brand__mark">N<span>+</span></span>
          <span className="pp-brand__label">Grupo de Estudos</span>
        </div>
        <nav className="pp-nav" aria-label="Navegação da plataforma">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={currentNav === item.id ? 'is-active' : ''}
              aria-pressed={currentNav === item.id}
              onClick={() => setView(item.id)}
            >
              <PreviewIcon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <a className="pp-nav__external" href="https://www.instagram.com/gruponutriwork" target="_blank" rel="noreferrer">
          <PreviewIcon name="instagram" />
          <span>Instagram</span>
        </a>
        <div className="pp-user">
          <span className="pp-user__avatar">EN</span>
          <span className="pp-user__name">Equipe Nutriwork</span>
        </div>
      </aside>

      <main className="pp-main" key={view}>
        {view === 'home' && (
          <section className="pp-view pp-home" aria-label="Início">
            <header className="pp-hero">
              <span className="pp-eyebrow">Grupo de Estudos</span>
              <strong>De estudantes, para estudantes</strong>
              <p>Nutrição realmente Baseada em Evidências.</p>
            </header>

            <article className="pp-welcome">
              <span className="pp-welcome__avatar">EN</span>
              <div>
                <strong>Seja bem-vindo(a) ao Nutriwork Plus!</strong>
                <p>Explore os módulos, siga sua trilha de aprendizado e avance no seu ritmo.</p>
              </div>
            </article>

            <div className="pp-section">
              <div className="pp-section__head">
                <h3>Continuar assistindo</h3>
                <button type="button" className="pp-link" onClick={() => setView('continuar')}>Ver tudo</button>
              </div>
              <div className="pp-rail">
                {continueWatching.map((item) => (
                  <button type="button" className="pp-watch" key={item.title} onClick={() => setView('continuar')}>
                    <span className="pp-thumb">
                      <span className="pp-thumb__brand">NUTRIWORK<i>+</i></span>
                      <span className="pp-thumb__play"><PreviewIcon name="play" /></span>
                    </span>
                    <span className="pp-watch__title">{item.title}</span>
                    <span className="pp-watch__module">{item.module}</span>
                    <span className="pp-bar"><i style={{ width: `${item.progress}%` }} /></span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pp-section">
              <div className="pp-section__head">
                <h3>Em destaque</h3>
                <button type="button" className="pp-link" onClick={() => setView('podcasts')}>Podcasts</button>
              </div>
              <div className="pp-chips">
                {extras.map((extra) => (
                  <button type="button" className="pp-chip" key={extra} onClick={() => setView('grupo')}>{extra}</button>
                ))}
                <button type="button" className="pp-chip pp-chip--accent" onClick={() => setView('podcasts')}>
                  <PreviewIcon name="mic" /> NWcast
                </button>
              </div>
            </div>
          </section>
        )}

        {view === 'continuar' && (
          <section className="pp-view" aria-label="Continuar assistindo">
            <header className="pp-view__head"><h2>Continuar assistindo</h2><p>Retome de onde parou.</p></header>
            <div className="pp-grid pp-grid--watch">
              {continueWatching.map((item) => (
                <article className="pp-watch pp-watch--row" key={item.title}>
                  <span className="pp-thumb">
                    <span className="pp-thumb__brand">NUTRIWORK<i>+</i></span>
                    <span className="pp-thumb__play"><PreviewIcon name="play" /></span>
                  </span>
                  <span className="pp-watch__title">{item.title}</span>
                  <span className="pp-watch__module">{item.module}</span>
                  <span className="pp-bar"><i style={{ width: `${item.progress}%` }} /></span>
                </article>
              ))}
            </div>
          </section>
        )}

        {view === 'grupo' && (
          <section className="pp-view" aria-label="Grupo de Estudos">
            <header className="pp-view__head"><h2>Todos os módulos</h2><p>Sua trilha completa de Nutrição.</p></header>
            <div className="pp-grid pp-grid--modules">
              {modules.map((module) => (
                <button type="button" className={`pp-module pp-module--${module.id}`} key={module.id} onClick={() => openModule(module)}>
                  <span className="pp-module__cover">
                    <span className="pp-module__tag">{module.tag}</span>
                    <span className="pp-module__brand">NUTRIWORK<i>+</i></span>
                  </span>
                  <span className="pp-module__title">{module.title}</span>
                  <span className="pp-module__meta">{module.lessons} aulas</span>
                </button>
              ))}
            </div>
            <div className="pp-section__head"><h3>Seus extras</h3></div>
            <div className="pp-chips">
              {extras.map((extra) => <span className="pp-chip" key={extra}>{extra}</span>)}
            </div>
          </section>
        )}

        {view === 'modulo' && (
          <section className="pp-view pp-module-detail" aria-label={`Módulo ${activeModule.title}`}>
            <button type="button" className="pp-back" onClick={() => setView('grupo')}><PreviewIcon name="arrow" /> Voltar aos módulos</button>
            <article className={`pp-module-detail__hero pp-module--${activeModule.id}`}>
              <div>
                <span className="pp-eyebrow">Bem-vindo ao Nutriwork+</span>
                <strong>{activeModule.title}</strong>
                <p>2 módulos · 3 aulas</p>
                <span className="pp-resume"><PreviewIcon name="play" /> Retomar</span>
              </div>
              <span className="pp-module-detail__brand">NUTRIWORK<i>+</i></span>
            </article>
            <ol className="pp-lessons">
              {moduleLessons.map((lesson, index) => (
                <li className="pp-lesson" key={lesson.title}>
                  <span className="pp-lesson__index">{index === 0 ? <PreviewIcon name="check" /> : index + 1}</span>
                  <span className="pp-lesson__body">
                    <strong>{lesson.title}</strong>
                    <small>{lesson.note}</small>
                  </span>
                  <span className="pp-lesson__time"><PreviewIcon name="clock" />{lesson.length}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {view === 'podcasts' && (
          <section className="pp-view" aria-label="Podcasts">
            <header className="pp-view__head"><h2>Podcasts</h2><p>NWcast — conversas com a comunidade.</p></header>
            <div className="pp-grid pp-grid--podcasts">
              {podcasts.map((episode) => (
                <article className="pp-podcast" key={episode.n}>
                  <span className="pp-podcast__cover"><PreviewIcon name="mic" /><i>NWcast</i></span>
                  <span className="pp-podcast__n">{episode.n} · {episode.guest}</span>
                  <strong className="pp-podcast__title">{episode.title}</strong>
                </article>
              ))}
            </div>
          </section>
        )}

        {view === 'suporte' && (
          <section className="pp-view pp-support" aria-label="Suporte">
            <header className="pp-view__head"><h2>Suporte</h2><p>Precisa de ajuda? A equipe responde rápido.</p></header>
            <div className="pp-support__cards">
              <article><span className="pp-support__icon"><PreviewIcon name="support" /></span><strong>Central de ajuda</strong><p>Dúvidas sobre acesso, módulos e trilhas.</p></article>
              <article><span className="pp-support__icon"><PreviewIcon name="play" /></span><strong>Como começar</strong><p>Siga o módulo “O começo” e ative sua trilha.</p></article>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
