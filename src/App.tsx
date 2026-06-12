import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import {
  comparison,
  courses,
  estudeAudience,
  estudeBenefits,
  estudeObjections,
  evidenceLearning,
  extras,
  faqItems,
  navItems,
  platformBenefits,
  platformPlans,
  promises,
  testimonials
} from './data';

const checkout = {
  complete: 'https://pay.kiwify.com.br/nyBH9vq',
  guide: 'https://pay.kiwify.com.br/fPEAkDX',
  monthly: 'https://pay.kiwify.com.br/pO6p0QM',
  quarterly: 'https://pay.kiwify.com.br/bfYt1Pt',
  semiannual: 'https://pay.kiwify.com.br/TbFu6TD'
};

const platformVideo = 'https://gruponutriwork.com.br/_assets/video/121f9f7d30c317a4871e3f531eb5287d.mp4';

type Theme = 'light' | 'dark';
type Page = 'home' | 'estude';

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

function useScrollReveal(refreshKey: unknown) {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [refreshKey]);
}

function useMobileCtaVisibility(refreshKey: unknown) {
  useEffect(() => {
    const cta = document.querySelector<HTMLElement>('.mobile-cta');
    const protectedSections = document.querySelectorAll('.estude-section, .study-benefits, .mentor-section, .pricing-section, .faq-section, .footer');
    if (!cta || !protectedSections.length) return;

    const visibleSections = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting ? visibleSections.add(entry.target) : visibleSections.delete(entry.target));
        cta.classList.toggle('mobile-cta--hidden', visibleSections.size > 0);
      },
      { threshold: 0.04 }
    );

    protectedSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [refreshKey]);
}

function getCurrentPage(): Page {
  return window.location.hash === '#/estude' ? 'estude' : 'home';
}

function useCurrentPage() {
  const [page, setPage] = useState<Page>(() => getCurrentPage());

  useEffect(() => {
    const updatePage = () => setPage(getCurrentPage());
    window.addEventListener('hashchange', updatePage);
    return () => window.removeEventListener('hashchange', updatePage);
  }, []);

  return page;
}

function useHashScroll(page: Page) {
  useEffect(() => {
    if (page === 'estude') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const hash = window.location.hash;
    if (!hash || hash.startsWith('#/')) return;

    window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
    });
  }, [page]);
}

function Icon({ name }: { name: string }) {
  const paths: Record<string, ReactNode> = {
    brain: <><path d="M9 5.2a3.2 3.2 0 0 0-5.2 2.5 3.1 3.1 0 0 0 .8 5.9A3.3 3.3 0 0 0 9 18.5V5.2Z"/><path d="M15 5.2a3.2 3.2 0 0 1 5.2 2.5 3.1 3.1 0 0 1-.8 5.9 3.3 3.3 0 0 1-4.4 4.9V5.2Z"/><path d="M9 9H7.2M15 9h1.8M9 14H7m8 0h2"/></>,
    student: <><circle cx="12" cy="7" r="3"/><path d="M5 20v-2.4A5.6 5.6 0 0 1 10.6 12h2.8a5.6 5.6 0 0 1 5.6 5.6V20M3 6l9-4 9 4-9 4-9-4Z"/></>,
    structure: <><rect x="4" y="3" width="16" height="5" rx="1.5"/><rect x="4" y="16" width="7" height="5" rx="1.5"/><rect x="13" y="16" width="7" height="5" rx="1.5"/><path d="M12 8v4M7.5 12h9M7.5 12v4M16.5 12v4"/></>,
    evidence: <><rect x="4" y="3" width="12" height="16" rx="2"/><path d="M8 7h4M8 11h5M8 15h3"/><circle cx="17" cy="16" r="3"/><path d="m19.3 18.3 2.2 2.2"/></>,
    trend: <path d="m3 17 6-6 4 4 8-9M16 6h5v5"/>,
    cap: <><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 11.5V16c3.5 2.5 8.5 2.5 12 0v-4.5M22 9v7"/></>,
    light: <><path d="M9 18h6M10 22h4"/><path d="M8.2 14.5A7 7 0 1 1 15.8 14.5 5 5 0 0 0 14 18h-4a5 5 0 0 0-1.8-3.5Z"/></>,
    book: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23V5.5ZM20 5.5A3.5 3.5 0 0 0 16.5 2H12v18h4.5A3.5 3.5 0 0 1 20 23V5.5Z"/></>,
    podcast: <><circle cx="12" cy="11" r="3"/><path d="M7.2 15.8a6.8 6.8 0 1 1 9.6 0M4.5 18.5a10.5 10.5 0 1 1 15 0M12 14v8M9 22h6"/></>,
    play: <><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3V9Z"/></>,
    analysis: <><path d="M5 3h10l4 4v14H5V3Z"/><path d="M15 3v5h5M8 12h7M8 16h4"/><circle cx="16.5" cy="16.5" r="2.5"/></>,
    heart: <path d="M20.8 5.7a5.4 5.4 0 0 0-7.6 0L12 6.9l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 22l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z"/>,
    check: <path d="m4 12 5 5L20 6"/>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>,
    phone: <><path d="M8 3h8l1 3-2 2a15 15 0 0 0 3 3l2-2 3 1v8c0 1.1-.9 2-2 2C11.1 20 4 12.9 4 4a2 2 0 0 1 2-2l2 1Z"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></>,
    moon: <path d="M20.7 15.2A8.6 8.6 0 0 1 8.8 3.3 9 9 0 1 0 20.7 15.2Z"/>,
    pause: <><rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/></>,
    gauge: <><path d="M4 14a8 8 0 0 1 16 0"/><path d="M6.2 19a9.8 9.8 0 0 1-2.2-6 8 8 0 0 1 16 0 9.8 9.8 0 0 1-2.2 6Z"/><path d="m12 14 4-5"/><circle cx="12" cy="14" r="1"/></>,
    volume: <><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></>,
    volumeOff: <><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="m18 9-5 5M13 9l5 5"/></>
  };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Button({ href, children, variant = 'primary', className = '', external = false }: { href: string; children: ReactNode; variant?: 'primary' | 'outline'; className?: string; external?: boolean }) {
  return <a className={`button button--${variant} ${className}`} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{children}</a>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', nextTheme === 'light' ? '#f4f7fc' : '#02040a');
    try {
      localStorage.setItem('nutriwork-theme', nextTheme);
    } catch {
      // The selected theme still applies when storage is unavailable.
    }
    setTheme(nextTheme);
    window.setTimeout(() => root.classList.remove('theme-transition'), 350);
  };

  return (
    <header className="site-header">
      <a className="brand" href="/#inicio" aria-label="Nutriwork Plus, voltar ao início">NUTRIWORK<span>+</span></a>
      <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Navegação principal">
        {navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" type="button" aria-label={`Tema atual: ${theme === 'dark' ? 'escuro' : 'claro'}. Alternar para tema ${nextTheme === 'dark' ? 'escuro' : 'claro'}.`} title={`Alternar para tema ${nextTheme === 'dark' ? 'escuro' : 'claro'}`} onClick={toggleTheme}>
          <span className="theme-toggle__track" aria-hidden="true">
            <span className="theme-toggle__icon theme-toggle__icon--sun"><Icon name="sun"/></span>
            <span className="theme-toggle__icon theme-toggle__icon--moon"><Icon name="moon"/></span>
            <span className="theme-toggle__thumb"><Icon name={theme === 'dark' ? 'moon' : 'sun'}/></span>
          </span>
        </button>
        <button className="menu-button" type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span/><span/><span/>
        </button>
      </div>
    </header>
  );
}

function SectionHeading({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return <h2 className={`section-heading ${accent ? 'section-heading--accent' : ''}`}>{children}</h2>;
}

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero__eclipse" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <Reveal className="hero__content">
        <h1>Nutriwork<span>plus.</span></h1>
        <p>Uma plataforma para todo estudante de Nutrição.</p>
        <div className="hero-actions">
          <Button href="/#planos" variant="outline">Venha fazer parte</Button>
          <Button href="https://plus.gruponutriwork.com.br/" variant="outline" className="member-cta" external>Já sou membro(a)</Button>
        </div>
      </Reveal>
    </section>
  );
}

function PlatformVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <>
      <video
        ref={videoRef}
        className="dashboard-video"
        autoPlay
        muted
        loop
        playsInline
        poster="/assets/platform-dashboard.jpg"
        aria-label="Previa em video da plataforma Nutriwork"
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onVolumeChange={(event) => setMuted(event.currentTarget.muted)}
      >
        <source src={platformVideo} type="video/mp4" />
      </video>
      <div className="video-controls" aria-label="Controles do video da plataforma">
        <button className="video-control" type="button" aria-label={paused ? 'Reproduzir video' : 'Pausar video'} title={paused ? 'Reproduzir video' : 'Pausar video'} onClick={togglePlayback}>
          <Icon name={paused ? 'play' : 'pause'} />
        </button>
        <button className="video-control" type="button" aria-label={muted ? 'Ativar som do video' : 'Silenciar video'} title={muted ? 'Ativar som' : 'Silenciar'} onClick={toggleMute}>
          <Icon name={muted ? 'volumeOff' : 'volume'} />
        </button>
      </div>
    </>
  );
}

function Platform() {
  return (
    <section id="sobre" className="section platform-section">
      <div className="page-width">
        <Reveal><SectionHeading accent>Veja o que nossa plataforma tem a oferecer:</SectionHeading></Reveal>
        <Reveal className="dashboard-shell">
          <div className="dashboard-lights" aria-hidden="true" />
          <PlatformVideo />
        </Reveal>
        <Reveal className="intro-copy">
          <h3>Um espaço para transformar a forma<br/>como você estuda nutrição.</h3>
          <p>O Nutriwork é uma comunidade de estudantes e profissionais de Nutrição criada para quem busca:</p>
        </Reveal>
        <div className="promise-grid">
          {promises.map((item) => <Reveal key={item.title} className="glass-card promise-card"><Icon name={item.icon}/><h3>{item.title}</h3></Reveal>)}
        </div>
        <Reveal><p className="mission">Nosso objetivo é preparar nutricionistas para uma<br/><strong>atuação mais segura, ética e atualizada.</strong></p></Reveal>
      </div>
    </section>
  );
}

function Courses() {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const groupWidthRef = useRef(0);
  const draggingRef = useRef(false);
  const hoverPausedRef = useRef(false);
  const focusPausedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);
  const momentumRef = useRef(0);

  const applyOffset = (nextOffset: number) => {
    const width = groupWidthRef.current;
    if (width > 0) {
      while (nextOffset <= -width) nextOffset += width;
      while (nextOffset > 0) nextOffset -= width;
    }
    offsetRef.current = nextOffset;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${nextOffset}px, 0, 0)`;
  };

  useEffect(() => {
    const track = trackRef.current;
    const firstGroup = firstGroupRef.current;
    if (!track || !firstGroup) return;

    const measure = () => {
      groupWidthRef.current = firstGroup.offsetWidth;
      applyOffset(offsetRef.current);
    };
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(firstGroup);
    measure();

    let frame = 0;
    let previousTime = performance.now();
    const animate = (time: number) => {
      const elapsed = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      const paused = draggingRef.current || hoverPausedRef.current || focusPausedRef.current;

      if (!paused && groupWidthRef.current > 0) {
        const cycleDuration = window.innerWidth <= 720 ? 44 : 54;
        const autoSpeed = groupWidthRef.current / cycleDuration;
        applyOffset(offsetRef.current + momentumRef.current * elapsed - autoSpeed * elapsed);
        momentumRef.current *= Math.exp(-5 * elapsed);
        if (Math.abs(momentumRef.current) < 2) momentumRef.current = 0;
      }

      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, []);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    draggingRef.current = true;
    focusPausedRef.current = false;
    momentumRef.current = 0;
    dragStartXRef.current = event.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = event.timeStamp;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.classList.add('is-dragging');
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const elapsed = Math.max(event.timeStamp - lastPointerTimeRef.current, 1);
    const delta = event.clientX - lastPointerXRef.current;
    momentumRef.current = Math.max(-700, Math.min(700, (delta / elapsed) * 1000));
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = event.timeStamp;
    applyOffset(dragStartOffsetRef.current + event.clientX - dragStartXRef.current);
  };

  const stopDragging = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    event.currentTarget.classList.remove('is-dragging');
    if (event.pointerType === 'touch') event.currentTarget.blur();
  };

  return (
    <section className="section courses-section">
      <div className="page-width">
        <Reveal><SectionHeading>Veja no que você vai se especializar</SectionHeading></Reveal>
        <Reveal>
          <div className="courses-carousel" role="region" aria-roledescription="carrossel" aria-label="Especializações Nutriwork" aria-describedby="courses-help">
            <p className="sr-only" id="courses-help">Carrossel automático com nove especializações. Arraste para navegar. Passe o mouse ou mantenha o foco no carrossel para pausar.</p>
            <div
              className="courses-track"
              ref={trackRef}
              tabIndex={0}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
              onPointerEnter={(event) => { if (event.pointerType === 'mouse') hoverPausedRef.current = true; }}
              onPointerLeave={(event) => { if (event.pointerType === 'mouse') hoverPausedRef.current = false; }}
              onFocus={(event) => { focusPausedRef.current = event.currentTarget.matches(':focus-visible'); }}
              onBlur={() => { focusPausedRef.current = false; }}
            >
              {[0, 1].map((group) => (
                <div className="courses-group" ref={group === 0 ? firstGroupRef : undefined} role={group === 0 ? 'list' : undefined} aria-hidden={group === 1} key={group}>
                  {courses.map((course, index) => (
                    <article className="course-card" role={group === 0 ? 'listitem' : undefined} key={`${group}-${course.title}`}>
                      <img src={course.image} alt={group === 0 ? `Capa do curso ${course.title}` : ''} width="536" height="800" loading="lazy" decoding="async" draggable="false" />
                      <div className="course-card__shade" aria-hidden="true" />
                      <div className="course-card__overlay">
                        <span>Especialização {String(index + 1).padStart(2, '0')}</span>
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Extras() {
  return (
    <section id="beneficios" className="section extras-section">
      <div className="page-width">
        <Reveal><SectionHeading>Extras que tornam a experiência<br/>completa para você</SectionHeading></Reveal>
        <Reveal><p className="extras-lead">Recursos complementares para aprofundar o conteúdo, revisar com autonomia e continuar próximo da comunidade.</p></Reveal>
        <div className="extras-grid">
          {extras.map((extra) => <Reveal key={extra.title}><article className="extra-card"><Icon name={extra.icon}/><div><h3>{extra.title}</h3><p>{extra.label}</p></div></article></Reveal>)}
        </div>
        <Reveal className="path-intro"><p>Veja como esse projeto se integra à sua<br/>jornada acadêmica e profissional.</p><h2>Dois caminhos.</h2><span>resultados diferentes.</span></Reveal>
        <Reveal><Comparison /></Reveal>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <div className="comparison-card" role="table" aria-label="Comparacao entre estudar com e sem o Nutriwork">
      <div className="comparison-grid">
        <div className="comparison-header" role="row">
          <strong className="comparison-heading comparison-heading--foundation" role="columnheader">Fundamentos</strong>
          <span className="comparison-heading comparison-heading--positive" role="columnheader">Com Nutriwork</span>
          <span className="comparison-heading comparison-heading--negative" role="columnheader">Sem Nutriwork</span>
        </div>
        {comparison.map((row) => (
          <div className="comparison-row" role="row" key={row.area}>
            <strong className="comparison-cell comparison-foundation" role="rowheader">{row.area}</strong>
            <p className="comparison-cell comparison-positive" role="cell" data-label="Com Nutriwork"><Icon name="check"/>{row.with}</p>
            <p className="comparison-cell comparison-negative" role="cell" data-label="Sem Nutriwork">{row.without}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="section testimonials-section">
      <div className="page-width page-width--narrow">
        <div className="testimonials-grid">
          {testimonials.map((item) => <Reveal key={item.name}><article className="testimonial-card"><header><img src={item.image} alt={`Foto de ${item.name}`}/><div><h3>{item.name}</h3><p>{item.role}</p></div></header><blockquote>“{item.quote}”</blockquote><div className="stars" aria-label="5 de 5 estrelas">★★★★★</div></article></Reveal>)}
        </div>
        <Reveal className="testimonial-cta"><p>Se você acredita em nutrição com fundamento científico e<br/>troca genuína de conhecimento, <strong>aqui é o seu lugar.</strong></p><Button href="/#planos">Quero evoluir meus estudos!</Button></Reveal>
      </div>
    </section>
  );
}

function Estude() {
  const audienceIcons = ['trend', 'cap', 'light', 'book'];
  return (
    <section id="estude" className="section estude-section">
      <div className="page-width">
        <Reveal className="problem-card glass-card"><h2>Na prática, muitos estudantes lidam com:</h2><ul><li>Excesso de conteúdo;</li><li>Dificuldade em manter uma rotina que funcione de verdade.</li></ul></Reveal>
        <Reveal><p className="method-copy">Mas isso não é falta de esforço. <strong>É a<br/>ausência de método bem definido.</strong></p></Reveal>
        <Reveal className="estude-hero">
          <div className="estude-hero__copy"><p>É a partir dessa necessidade<br/>que nasce o</p><h2>Estude</h2></div>
          <img className="estude-cover" src="/assets/estude-cover.webp" alt="Capa do guia Estude" />
          <img className="estude-phone" src="/assets/estude-phone.webp" alt="Guia Estude sendo acessado pelo celular" />
          <span className="note note--one">Organização<br/>eficiente</span><span className="note note--two">Aplicação prática<br/>na rotina</span><span className="note note--three">Planejamento<br/>consciente</span><span className="note note--four">Constância sem<br/>sobrecarga</span>
          <p className="estude-description">Um guia de estudos desenvolvido para estruturar sua rotina de forma organizada, <strong>eficiente e sustentável</strong> ao longo da graduação e além dela, complementando o Nutriwork Plus.</p>
        </Reveal>
        <Reveal><p className="estude-detail">O material discute como se preparar melhor para provas e destaca fatores que influenciam o desempenho cognitivo, como sono, ambiente de estudo, exercício físico, nutrição, uso de cafeína e suplementos, além do impacto das redes sociais.</p></Reveal>
        <Reveal className="audience"><h2>O Estude foi planejado para quem:</h2>{estudeAudience.map((item, index) => <div key={item}><Icon name={audienceIcons[index]}/><p>{item}</p></div>)}</Reveal>
        <Reveal className="objections"><h2>Isto é, se você...</h2><div>{estudeObjections.map((item, index) => <article className="glass-card" key={item}><span>×</span><Icon name={['evidence','light','gauge'][index]}/><h3>{item}</h3></article>)}</div><p>Essa é a oportunidade certa.</p></Reveal>
      </div>
    </section>
  );
}

function StudyBenefits() {
  return (
    <section className="section study-benefits">
      <div className="page-width page-width--narrow">
        <Reveal><h2 className="blue-title">Tudo isso com:</h2><div className="benefits-panel">{estudeBenefits.map((benefit, index) => <article key={benefit.title}><Icon name={['light','evidence','book'][index]}/><div><h3>{benefit.title}</h3><p>{benefit.text}</p></div></article>)}<Button href={checkout.guide} external>Quero estudar melhor</Button></div></Reveal>
      </div>
    </section>
  );
}

function EstudePlan() {
  return (
    <section className="section estude-plan-section">
      <div className="page-width page-width--narrow">
        <Reveal className="pricing-card pricing-card--estude">
          <span className="corner-badge">À vista</span>
          <h2>Guia Estude</h2>
          <h3>Material prático para organizar<br/>seus estudos.</h3>
          <Price value="77,90"/>
          <ul>{['Estratégias para criar uma rotina possível','Orientações para manter constância','Material de apoio para aplicar no dia a dia','Acesso ao conteúdo completo do guia'].map((item) => <li key={item}><Icon name="check"/>{item}</li>)}</ul>
          <Button href={checkout.guide} external>Começar agora</Button>
        </Reveal>
      </div>
    </section>
  );
}

function Evidence() {
  return (
    <section className="section evidence-section">
      <div className="evidence-glow" aria-hidden="true" />
      <img className="evidence-shape" src="/assets/evidence-shape.webp" alt="" aria-hidden="true" />
      <div className="page-width page-width--narrow">
        <Reveal><h2><span>Conheça nosso</span><span>módulo especial de</span><em>Nutrição Baseada em Evidências</em><span>e aprenda a:</span></h2></Reveal>
        <div className="evidence-list">{evidenceLearning.map((item) => <Reveal key={item}><p>{item}</p></Reveal>)}</div>
      </div>
    </section>
  );
}

function Mentor() {
  return (
    <section className="section mentor-section">
      <div className="page-width page-width--narrow">
        <Reveal><p className="mentor-kicker">Com acompanhamento especial e <strong>direto</strong> de</p></Reveal>
        <Reveal className="mentor-card">
          <div className="mentor-copy"><h2>Gabriel Schuchter</h2><h3>Fundador e professor do Nutriwork</h3><p>Bacharel em Nutrição formado pela Universidade Federal de Uberlândia (UFU), pesquisador e consultor de pesquisa, com atuação concentrada em revisões sistemáticas e meta-análises. É analista do Reviews, plataforma que oferece análises críticas e interpretações técnicas de artigos científicos para profissionais da saúde.</p><p>É fundador do Nutriwork, o maior grupo de Nutrição Baseada em Evidências do Brasil, e atua como professor de Prática Baseada em Evidências, já tendo ministrado aulas e formações para cursos de Psicologia, Medicina, Nutrição, Fisioterapia e Enfermagem.</p><p>Além da atuação acadêmica, Gabriel é mentor em Prática Baseada em Evidências e pesquisa científica, orientando alunos e profissionais no desenvolvimento de leitura crítica, projetos científicos e tomada de decisão baseada em evidências. Seu trabalho é voltado a formar profissionais mais críticos, tecnicamente seguros e alinhados com a ciência de alta qualidade aplicada à prática em saúde.</p></div>
          <figure className="mentor-photo"><img src="/assets/mentor-gabriel.webp" alt="Gabriel Schuchter, fundador e professor do Nutriwork" width="1070" height="1600" /></figure>
        </Reveal>
      </div>
    </section>
  );
}

function Price({ value, monthly = false }: { value: string; monthly?: boolean }) {
  const [whole, cents] = value.split(',');
  return <div className="price"><span>R$</span>{whole}<small>,{cents}{monthly ? '/mês' : ''}</small></div>;
}

function Pricing() {
  const planLinks = [checkout.monthly, checkout.quarterly, checkout.semiannual];
  return (
    <section id="planos" className="section pricing-section">
      <div className="page-width page-width--narrow">
        <Reveal><SectionHeading>Planos pensados para se adaptar à sua<br/>rotina de estudos</SectionHeading></Reveal>
        <Reveal className="pricing-card pricing-card--featured"><img className="featured-badge" src="/assets/featured-badge.webp" alt="Plano destaque"/><h2>Nutriwork Plus Anual</h2><h3>A experiência completa Nutriwork.</h3><Price value="24,90" monthly/><span className="payment-note">*pagamento à vista</span><ul>{['Aprofunde-se com nossos cursos completos.','Mantenha acesso à plataforma durante 1 ano.','Acompanhe evoluções, ajustes e novos conteúdos.','Estude com clareza, método e constância.','Tenha uma experiência completa de formação.'].map((item) => <li key={item}><Icon name="check"/>{item}</li>)}</ul><div className="pricing-actions"><Button href={checkout.complete} external>Garantir plano completo</Button><Button href="/#/estude" variant="outline" className="pricing-card__secondary">Conheça o ESTUDE</Button></div><div className="scarcity">🔥 últimas vagas restantes!</div></Reveal>
        <Reveal className="pricing-card pricing-card--estude"><span className="corner-badge">À vista</span><h2>Guia Estude</h2><h3>Material prático para organizar<br/>seus estudos.</h3><Price value="77,90"/><ul>{['Estratégias para criar uma rotina possível','Orientações para manter constância','Material de apoio para aplicar no dia a dia','Acesso ao conteúdo completo do guia'].map((item) => <li key={item}><Icon name="check"/>{item}</li>)}</ul><Button href={checkout.guide} external>Começar agora</Button></Reveal>
        <Reveal className="platform-pricing"><header><div><h2>Planos nutriwork</h2><p>Acesso à plataforma Nutriwork.</p></div><span>À vista</span></header><div className="mini-plans">{platformPlans.map((plan, index) => <article key={plan.title}><h3>{plan.title}</h3><Price value={plan.price}/><p>por mês.</p><Button href={planLinks[index]} external>Quero assinar</Button></article>)}</div><ul>{platformBenefits.map((item) => <li key={item}><Icon name="check"/>{item}</li>)}</ul></Reveal>
      </div>
    </section>
  );
}

function FaqItem({ item, index }: { item: typeof faqItems[number]; index: number }) {
  const [open, setOpen] = useState(false);
  const contentId = `faq-answer-${index}`;

  return (
    <Reveal>
      <article className={`faq-item ${open ? 'faq-item--open' : ''}`}>
        <button type="button" aria-expanded={open} aria-controls={contentId} onClick={() => setOpen((value) => !value)}>
          {item.question}
          <span aria-hidden="true">+</span>
        </button>
        <div className="faq-answer" id={contentId} role="region">
          <div><p>{item.answer}</p></div>
        </div>
      </article>
    </Reveal>
  );
}

function FAQ() {
  return (
    <section id="duvidas" className="section faq-section">
      <div className="page-width page-width--narrow">
        <Reveal><SectionHeading>Dúvidas frequentes</SectionHeading><p className="faq-intro">Informações diretas para você escolher com segurança e começar seus estudos.</p></Reveal>
        <div className="faq-list">
          {faqItems.map((item, index) => <FaqItem item={item} index={index} key={item.question} />)}
        </div>
        <Reveal className="faq-cta"><p>Pronto para fazer parte?</p><Button href="/#planos">Conhecer os planos</Button></Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contatos" className="footer">
      <div className="footer-orbit" aria-hidden="true" />
      <div className="page-width">
        <Reveal><h2>Venha fazer parte do grupo de<br/>Nutrição Baseada em Evidências<br/>que mais cresce no Brasil.</h2></Reveal>
        <div className="footer-grid">
          <div><p className="footer-label">Visite nossas redes sociais:</p><a href="https://www.instagram.com/gruponutriwork" target="_blank" rel="noreferrer"><Icon name="instagram"/>@gruponutriwork</a><p>Você lidera um projeto e gostaria de se tornar<br/>parceiro do Nutriwork?</p><Button href="https://forms.gle/avn9yrBdbEHkaGg8A" external variant="outline">Torne-se parceiro Nutriwork</Button></div>
          <div><h3>Dúvidas? Entre em contato.</h3><a href="tel:+5512997505188"><Icon name="phone"/><span><small>Telefone</small>(12) 99750-5188</span></a><a href="mailto:equipenutriwork@gmail.com"><Icon name="mail"/><span><small>E-mail</small>equipenutriwork@gmail.com</span></a></div>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Nutriwork. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

function HomePage() {
  return <main><Hero/><Platform/><Courses/><Extras/><Testimonials/><Evidence/><Mentor/><Pricing/><FAQ/></main>;
}

function EstudePage() {
  return <main className="estude-page"><Estude/><StudyBenefits/><EstudePlan/></main>;
}

export default function App() {
  const page = useCurrentPage();
  useScrollReveal(page);
  useMobileCtaVisibility(page);
  useHashScroll(page);

  return <><Header/>{page === 'estude' ? <EstudePage/> : <HomePage/>}<Footer/><Button href="/#planos" className="mobile-cta">Ver planos</Button></>;
}
