import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
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
import ReferencesSection from './components/ReferencesSection';

const checkout = {
  complete: 'https://pay.kiwify.com.br/nyBH9vq',
  guide: 'https://pay.kiwify.com.br/fPEAkDX',
  monthly: 'https://pay.kiwify.com.br/pO6p0QM',
  quarterly: 'https://pay.kiwify.com.br/bfYt1Pt',
  semiannual: 'https://pay.kiwify.com.br/TbFu6TD'
};

const contactEmail = 'equipenutriwork@gmail.com';
const partnerForm = 'https://forms.gle/avn9yrBdbEHkaGg8A';
const whatsappContact = `https://wa.me/5512997505188?text=${encodeURIComponent('Olá, equipe Nutriwork! Vim pelo site e gostaria de tirar uma dúvida sobre o Nutriwork Plus.')}`;
type Theme = 'light' | 'dark';
type Page = 'home' | 'estude' | 'partners';
type LoadingVariant = 'intro' | 'return' | 'route';
type LoadingExperienceState = { active: boolean; variant: LoadingVariant; page: Page };

const loaderStorageKey = 'nutriwork-loading-experience-seen';
const loaderMinimumDuration: Record<LoadingVariant, number> = {
  intro: 1350,
  return: 1000,
  route: 1100
};
const loaderContentSwapDelay = 260;
const spiralConfig = {
  particleCount: 86,
  trailSpan: 0.28,
  durationMs: 3200,
  pulseDurationMs: 3600,
  strokeWidth: 4.3,
  searchTurns: 4,
  searchBaseRadius: 8,
  searchRadiusAmp: 8.5,
  searchPulse: 2.4,
  searchScale: 1
};

const PartnersGlobeCard = lazy(() => import('./components/PartnersGlobeCard'));

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>;
}

function useScrollReveal(refreshKey: unknown) {
  useEffect(() => {
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
    const protectedSections = document.querySelectorAll('.references-section, .estude-section, .study-benefits, .mentor-section, .pricing-section, .faq-section, .partners-page, .footer');
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
  if (window.location.hash === '#/estude') return 'estude';
  if (window.location.hash === '#/parceiros') return 'partners';
  return 'home';
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
    if (page !== 'home') {
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

function hasSeenLoadingExperience() {
  try {
    return localStorage.getItem(loaderStorageKey) === '1' || sessionStorage.getItem(loaderStorageKey) === '1';
  } catch {
    return false;
  }
}

function markLoadingExperienceSeen() {
  try {
    localStorage.setItem(loaderStorageKey, '1');
    sessionStorage.setItem(loaderStorageKey, '1');
  } catch {
    // The experience should still complete when storage is unavailable.
  }
}

function waitForDelay(delay: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, Math.max(0, delay)));
}

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve()));
  });
}

async function waitForRenderedPage() {
  await waitForNextPaint();

  const fontsReady = document.fonts?.ready ?? Promise.resolve();
  const images = Array.from(document.querySelectorAll<HTMLImageElement>('main img'))
    .filter((image) => image.loading !== 'lazy');
  const imagesReady = images.map((image) => {
    if (image.complete) return image.decode?.().catch(() => undefined) ?? Promise.resolve();

    return new Promise<void>((resolve) => {
      image.addEventListener('load', () => resolve(), { once: true });
      image.addEventListener('error', () => resolve(), { once: true });
    });
  });

  await Promise.allSettled([fontsReady, ...imagesReady]);
}

function useLoadingExperience(page: Page) {
  const hasHandledFirstPage = useRef(false);
  const currentPageRef = useRef(page);
  const initialStartedAt = useRef(performance.now());
  const [renderedPage, setRenderedPage] = useState(page);
  const [loading, setLoading] = useState<LoadingExperienceState>(() => {
    const seen = hasSeenLoadingExperience();
    return { active: true, variant: seen ? 'return' : 'intro', page };
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('loading-active', loading.active);
    return () => root.classList.remove('loading-active');
  }, [loading.active]);

  useEffect(() => {
    const initialVariant = loading.variant;
    let cancelled = false;
    let removeLoadListener = () => {};

    const windowReady = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          const handleLoad = () => resolve();
          window.addEventListener('load', handleLoad, { once: true });
          removeLoadListener = () => window.removeEventListener('load', handleLoad);
        });

    const minimumVisible = waitForDelay(
      loaderMinimumDuration[initialVariant] - (performance.now() - initialStartedAt.current)
    );

    void Promise.all([
      windowReady,
      document.fonts?.ready ?? Promise.resolve(),
      minimumVisible
    ]).then(() => {
      if (cancelled) return;
      markLoadingExperienceSeen();
      setLoading((current) => (
        current.variant === initialVariant && current.active
          ? { ...current, active: false }
          : current
      ));
    });

    return () => {
      cancelled = true;
      removeLoadListener();
    };
  }, []);

  useLayoutEffect(() => {
    if (!hasHandledFirstPage.current) {
      hasHandledFirstPage.current = true;
      currentPageRef.current = page;
      return;
    }

    if (currentPageRef.current === page) {
      return;
    }

    currentPageRef.current = page;

    const root = document.documentElement;
    const transitionStartedAt = performance.now();
    let cancelled = false;
    let routeClassTimer = 0;
    root.classList.add('route-transition');
    setLoading({ active: true, variant: 'route', page });

    const swapTimer = window.setTimeout(() => {
      setRenderedPage(page);

      void Promise.all([
        waitForRenderedPage(),
        waitForDelay(loaderMinimumDuration.route - (performance.now() - transitionStartedAt))
      ]).then(() => {
        if (cancelled) return;
        setLoading((current) => (
          current.variant === 'route' && current.page === page
            ? { ...current, active: false }
            : current
        ));
        routeClassTimer = window.setTimeout(
          () => root.classList.remove('route-transition'),
          680
        );
      });
    }, loaderContentSwapDelay);

    return () => {
      cancelled = true;
      window.clearTimeout(swapTimer);
      window.clearTimeout(routeClassTimer);
      root.classList.remove('route-transition');
    };
  }, [page]);

  return { loading, renderedPage };
}

function normalizeProgress(progress: number) {
  return ((progress % 1) + 1) % 1;
}

function getSpiralPoint(progress: number, detailScale: number) {
  const t = progress * Math.PI * 2;
  const angle = t * spiralConfig.searchTurns;
  const radius = spiralConfig.searchBaseRadius + (1 - Math.cos(t)) * (spiralConfig.searchRadiusAmp + detailScale * spiralConfig.searchPulse);

  return {
    x: 50 + Math.cos(angle) * radius * spiralConfig.searchScale,
    y: 50 + Math.sin(angle) * radius * spiralConfig.searchScale
  };
}

function getSpiralDetailScale(time: number) {
  const pulseProgress = (time % spiralConfig.pulseDurationMs) / spiralConfig.pulseDurationMs;
  const pulseAngle = pulseProgress * Math.PI * 2;
  return 0.52 + ((Math.sin(pulseAngle + 0.55) + 1) / 2) * 0.48;
}

function buildSpiralPath(detailScale: number, steps = 360) {
  return Array.from({ length: steps + 1 }, (_, index) => {
    const point = getSpiralPoint(index / steps, detailScale);
    return `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }).join(' ');
}

function SpiralSearchLoader({ active, compact = false }: { active: boolean; compact?: boolean }) {
  const pathRef = useRef<SVGPathElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const particlesRef = useRef<SVGCircleElement[]>([]);
  const particleCount = compact ? 58 : spiralConfig.particleCount;

  useEffect(() => {
    if (!active) return;

    const path = pathRef.current;
    const group = groupRef.current;
    if (!path || !group) return;

    particlesRef.current = particlesRef.current.slice(0, particleCount);
    path.setAttribute('stroke-width', String(compact ? 3.7 : spiralConfig.strokeWidth));

    let frame = 0;
    const startedAt = performance.now();
    const render = (now: number) => {
      const time = now - startedAt + (compact ? 1850 : 0);
      const progress = (time % spiralConfig.durationMs) / spiralConfig.durationMs;
      const detailScale = getSpiralDetailScale(time);

      path.setAttribute('d', buildSpiralPath(detailScale, compact ? 260 : 360));
      group.setAttribute('transform', `rotate(${compact ? -8 : 0} 50 50)`);

      particlesRef.current.forEach((node, index) => {
        const tailOffset = index / Math.max(particleCount - 1, 1);
        const point = getSpiralPoint(normalizeProgress(progress - tailOffset * spiralConfig.trailSpan), detailScale);
        const fade = Math.pow(1 - tailOffset, 0.56);

        node.setAttribute('cx', point.x.toFixed(2));
        node.setAttribute('cy', point.y.toFixed(2));
        node.setAttribute('r', (0.9 + fade * (compact ? 2.1 : 2.7)).toFixed(2));
        node.setAttribute('opacity', (0.05 + fade * 0.9).toFixed(3));
      });

      frame = window.requestAnimationFrame(render);
    };

    render(startedAt);
    return () => window.cancelAnimationFrame(frame);
  }, [active, compact, particleCount]);

  return (
    <svg className={`spiral-loader ${compact ? 'spiral-loader--compact' : ''}`} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <g ref={groupRef}>
        <path ref={pathRef} className="spiral-loader__path" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" opacity="0.12" />
        {Array.from({ length: particleCount }, (_, index) => (
          <circle
            key={index}
            ref={(node) => {
              if (node) particlesRef.current[index] = node;
            }}
            fill="currentColor"
          />
        ))}
      </g>
    </svg>
  );
}

function SkeletonBlock({ className = '' }: { className?: string }) {
  return <span className={`skeleton-block ${className}`} />;
}

function LoadingTestimonial({ long = false }: { long?: boolean }) {
  return (
    <article className={`loading-testimonial ${long ? 'loading-testimonial--long' : ''}`}>
      <div className="loading-testimonial__header">
        <SkeletonBlock className="skeleton-avatar" />
        <div>
          <SkeletonBlock className="skeleton-line skeleton-line--name" />
          <SkeletonBlock className="skeleton-line skeleton-line--role" />
        </div>
      </div>
      <SkeletonBlock className="skeleton-line skeleton-line--wide" />
      <SkeletonBlock className="skeleton-line skeleton-line--wide" />
      <SkeletonBlock className="skeleton-line skeleton-line--medium" />
      <SkeletonBlock className="skeleton-stars" />
    </article>
  );
}

function LoadingSkeleton({ page, compact }: { page: Page; compact: boolean }) {
  if (page === 'home') return null;

  if (page === 'estude') {
    return (
      <div className={`loading-skeleton loading-skeleton--estude ${compact ? 'loading-skeleton--compact' : ''}`}>
        <div className="loading-skeleton__grid loading-skeleton__grid--estude">
          <div className="loading-skeleton__copy">
            <SkeletonBlock className="skeleton-kicker" />
            <SkeletonBlock className="skeleton-title skeleton-title--estude" />
            <SkeletonBlock className="skeleton-line skeleton-line--wide" />
            <SkeletonBlock className="skeleton-line skeleton-line--medium" />
            <SkeletonBlock className="skeleton-button" />
          </div>
          <div className="loading-phone">
            <SkeletonBlock className="loading-phone__device" />
            <SkeletonBlock className="loading-chip loading-chip--one" />
            <SkeletonBlock className="loading-chip loading-chip--two" />
            <SkeletonBlock className="loading-chip loading-chip--three" />
          </div>
        </div>
        <div className="loading-estude-body">
          <div className="loading-problem-card">
            <SkeletonBlock className="skeleton-line skeleton-line--medium" />
            <SkeletonBlock className="skeleton-line skeleton-line--wide" />
            <SkeletonBlock className="skeleton-line skeleton-line--short" />
          </div>
          <div className="loading-estude-panel">
            <SkeletonBlock className="skeleton-title skeleton-title--compact" />
            <SkeletonBlock className="loading-phone__device loading-phone__device--small" />
            <SkeletonBlock className="loading-chip loading-chip--panel-one" />
            <SkeletonBlock className="loading-chip loading-chip--panel-two" />
          </div>
        </div>
      </div>
    );
  }

  if (page === 'partners') {
    return (
      <div className={`loading-skeleton loading-skeleton--partners ${compact ? 'loading-skeleton--compact' : ''}`}>
        <div className="loading-skeleton__grid loading-skeleton__grid--partners">
          <div className="loading-skeleton__copy">
            <SkeletonBlock className="skeleton-kicker" />
            <SkeletonBlock className="skeleton-title skeleton-title--partners" />
            <SkeletonBlock className="skeleton-line skeleton-line--wide" />
            <SkeletonBlock className="skeleton-line skeleton-line--medium" />
            <div className="skeleton-action-row">
              <SkeletonBlock className="skeleton-button" />
              <SkeletonBlock className="skeleton-link" />
            </div>
          </div>
          <div className="loading-partners-globe">
            <SkeletonBlock className="skeleton-kicker" />
            <SkeletonBlock className="skeleton-line skeleton-line--name" />
            <SkeletonBlock className="skeleton-line skeleton-line--wide" />
            <SkeletonBlock className="loading-partners-globe__sphere" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function LoadingExperience({ state }: { state: LoadingExperienceState }) {
  const compact = state.variant !== 'intro';
  const [present, setPresent] = useState(state.active);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state.active) {
      setPresent(true);
      const frame = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timer = window.setTimeout(
      () => setPresent(false),
      560
    );

    return () => window.clearTimeout(timer);
  }, [state.active]);

  return (
    <div className={`loading-experience loading-experience--${state.variant} ${visible ? 'loading-experience--active' : ''} ${present ? 'loading-experience--animating' : ''}`} aria-hidden="true">
      <div className="loading-experience__ambient" />
      <div className="loading-experience__brand">
        <div className="loading-experience__mark">N<span>+</span></div>
        <div className={`loading-experience__process ${compact ? 'loading-experience__process--compact' : ''}`}>
          <SpiralSearchLoader active={present} compact={compact} />
        </div>
      </div>
      <LoadingSkeleton page={state.page} compact={compact} />
    </div>
  );
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

type HeroDemoTab = 'dashboard' | 'lessons' | 'ebooks' | 'community';

const heroDemoTabs: Array<{ id: HeroDemoTab; label: string; eyebrow: string }> = [
  { id: 'dashboard', label: 'Início', eyebrow: 'Dashboard' },
  { id: 'lessons', label: 'Aulas', eyebrow: 'Trilha prática' },
  { id: 'ebooks', label: 'E-books', eyebrow: 'Biblioteca' },
  { id: 'community', label: 'Comunidade', eyebrow: 'Discussões' }
];

const heroDemoLessons = [
  {
    title: 'Estratégias para melhorar adesão em pacientes com rotina instável',
    tag: 'Clínica comportamental',
    duration: '18 min',
    progress: '68%'
  },
  {
    title: 'Como estruturar retornos mais objetivos e aplicáveis',
    tag: 'Consulta e retorno',
    duration: '14 min',
    progress: '42%'
  },
  {
    title: 'Planejamento alimentar prático sem excesso de complexidade',
    tag: 'Planejamento',
    duration: '22 min',
    progress: '27%'
  }
];

const heroDemoEbooks = [
  {
    title: 'Guia prático de acompanhamento nutricional',
    detail: 'Fluxos, condutas e perguntas para evoluir o plano com clareza.',
    pages: ['Anamnese aplicada', 'Objetivos por etapa', 'Registro de evolução']
  },
  {
    title: 'Checklist de primeira consulta e retorno',
    detail: 'Uma sequência enxuta para não perder informações importantes.',
    pages: ['Antes da consulta', 'Durante o atendimento', 'Plano de retorno']
  }
];

const heroDemoTopics = [
  {
    title: 'Discussão em alta: adesão alimentar no fim de semana',
    replies: '24 respostas',
    tag: 'Comportamento'
  },
  {
    title: 'Como explicar ajuste calórico sem gerar ansiedade?',
    replies: '16 respostas',
    tag: 'Comunicação'
  },
  {
    title: 'Modelos de retorno para pacientes com baixa disponibilidade',
    replies: '11 respostas',
    tag: 'Rotina clínica'
  }
];

function HeroMonitorDemo() {
  const [activeTab, setActiveTab] = useState<HeroDemoTab>('dashboard');
  const [selectedLesson, setSelectedLesson] = useState(heroDemoLessons[0]);
  const [selectedEbook, setSelectedEbook] = useState(heroDemoEbooks[0]);
  const [selectedTopic, setSelectedTopic] = useState(heroDemoTopics[0]);
  const [playing, setPlaying] = useState(false);
  const activeTabData = heroDemoTabs.find((tab) => tab.id === activeTab) ?? heroDemoTabs[0];

  const openLesson = (lesson = selectedLesson) => {
    setSelectedLesson(lesson);
    setActiveTab('lessons');
  };

  const openEbook = (ebook = selectedEbook) => {
    setSelectedEbook(ebook);
    setActiveTab('ebooks');
  };

  return (
    <div className="monitor-demo">
      <aside className="monitor-demo__sidebar" aria-label="Navegação da prévia">
        <div className="monitor-demo__brand">N<span>+</span></div>
        <nav>
          {heroDemoTabs.map((tab) => (
            <button
              key={tab.id}
              className={activeTab === tab.id ? 'is-active' : ''}
              type="button"
              aria-pressed={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="monitor-demo__main">
        <header className="monitor-demo__topbar">
          <div>
            <span>{activeTabData.eyebrow}</span>
            <strong>Nutriwork Plus</strong>
          </div>
          <span className="monitor-demo__badge">Novo módulo liberado</span>
        </header>

        <div className="monitor-demo__scroll" tabIndex={0} aria-label="Conteúdo navegável da prévia Nutriwork Plus">
          {activeTab === 'dashboard' && (
            <section className="monitor-demo__view monitor-demo__dashboard" aria-label="Dashboard da prévia">
              <button className="demo-spotlight demo-spotlight--brand" type="button" onClick={() => openLesson(heroDemoLessons[0])}>
                <span>Grupo de estudos</span>
                <strong>Nutriwork<span>+</span></strong>
                <small>Nutrição Baseada em Evidências</small>
              </button>
              <div className="demo-metrics">
                <article><strong>12</strong><span>aulas novas</span></article>
                <article><strong>4</strong><span>e-books ativos</span></article>
                <article><strong>87%</strong><span>trilha aplicada</span></article>
              </div>
              <div className="demo-next">
                <button type="button" onClick={() => openLesson(heroDemoLessons[0])}>
                  <span>Aula em destaque</span>
                  <strong>Adesão em pacientes com rotina instável</strong>
                </button>
                <button type="button" onClick={() => openEbook(heroDemoEbooks[1])}>
                  <span>Checklist recomendado</span>
                  <strong>Primeira consulta e retorno</strong>
                </button>
              </div>
              <div className="demo-next demo-next--secondary">
                <button type="button" onClick={() => setActiveTab('community')}>
                  <span>Comunidade</span>
                  <strong>Discussões aplicadas da semana</strong>
                </button>
                <button type="button" onClick={() => openEbook(heroDemoEbooks[0])}>
                  <span>Biblioteca</span>
                  <strong>Guia de acompanhamento nutricional</strong>
                </button>
              </div>
            </section>
          )}

          {activeTab === 'lessons' && (
            <section className="monitor-demo__view monitor-demo__lessons" aria-label="Aulas da prévia">
              <div className="demo-list">
                {heroDemoLessons.map((lesson) => (
                  <button
                    key={lesson.title}
                    className={selectedLesson.title === lesson.title ? 'is-selected' : ''}
                    type="button"
                    onClick={() => openLesson(lesson)}
                  >
                    <span>{lesson.tag}</span>
                    <strong>{lesson.title}</strong>
                    <small>{lesson.duration}</small>
                  </button>
                ))}
              </div>
              <article className="demo-player">
                <div className="demo-player__thumb">
                  <button type="button" aria-label={playing ? 'Pausar aula demonstrativa' : 'Reproduzir aula demonstrativa'} onClick={() => setPlaying((value) => !value)}>
                    <Icon name={playing ? 'pause' : 'play'} />
                  </button>
                </div>
                <span>{selectedLesson.tag} · {selectedLesson.duration}</span>
                <h3>{selectedLesson.title}</h3>
                <div className="demo-progress" aria-label={`Progresso demonstrativo ${selectedLesson.progress}`}>
                  <span style={{ width: selectedLesson.progress }} />
                </div>
              </article>
              <div className="demo-session-notes">
                <span>Próximos passos</span>
                <p>Aplicar uma meta simples, revisar barreiras de rotina e preparar um retorno com perguntas objetivas.</p>
              </div>
            </section>
          )}

          {activeTab === 'ebooks' && (
            <section className="monitor-demo__view monitor-demo__ebooks" aria-label="E-books da prévia">
              <div className="demo-ebook-grid">
                {heroDemoEbooks.map((ebook) => (
                  <button
                    key={ebook.title}
                    className={selectedEbook.title === ebook.title ? 'is-selected' : ''}
                    type="button"
                    onClick={() => openEbook(ebook)}
                  >
                    <span>E-book</span>
                    <strong>{ebook.title}</strong>
                  </button>
                ))}
              </div>
              <article className="demo-ebook-preview">
                <div className="demo-ebook-cover">
                  <span>PDF</span>
                  <strong>{selectedEbook.title}</strong>
                </div>
                <div>
                  <p>{selectedEbook.detail}</p>
                  <ul>
                    {selectedEbook.pages.map((page) => <li key={page}>{page}</li>)}
                  </ul>
                </div>
              </article>
              <div className="demo-session-notes">
                <span>Uso sugerido</span>
                <p>Salvar como roteiro de consulta, adaptar perguntas e combinar com a aula selecionada.</p>
              </div>
            </section>
          )}

          {activeTab === 'community' && (
            <section className="monitor-demo__view monitor-demo__community" aria-label="Comunidade da prévia">
              <div className="demo-community-list">
                {heroDemoTopics.map((topic) => (
                  <button
                    key={topic.title}
                    className={selectedTopic.title === topic.title ? 'is-selected' : ''}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <span>{topic.tag}</span>
                    <strong>{topic.title}</strong>
                    <small>{topic.replies}</small>
                  </button>
                ))}
              </div>
              <article className="demo-topic-card">
                <span>{selectedTopic.tag}</span>
                <h3>{selectedTopic.title}</h3>
                <p>Trocas entre estudantes e profissionais com foco em condutas possíveis, linguagem clara e acompanhamento aplicável.</p>
                <strong>{selectedTopic.replies}</strong>
              </article>
              <div className="demo-session-notes">
                <span>Síntese do tópico</span>
                <p>Priorize estratégias que preservem adesão sem transformar o plano alimentar em uma lista rígida de regras.</p>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function HeroMonitor() {
  const stageRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (window.matchMedia('(max-width: 720px)').matches) return;

    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    stage.style.setProperty('--hero-tilt-x', `${y * -1.8}deg`);
    stage.style.setProperty('--hero-tilt-y', `${x * 3.2}deg`);
    stage.style.setProperty('--hero-shift-x', `${x * 4}px`);
    stage.style.setProperty('--hero-shift-y', `${y * 3}px`);
  };

  const resetPointer = () => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.style.setProperty('--hero-tilt-x', '0deg');
    stage.style.setProperty('--hero-tilt-y', '0deg');
    stage.style.setProperty('--hero-shift-x', '0px');
    stage.style.setProperty('--hero-shift-y', '0px');
  };

  return (
    <div
      ref={stageRef}
      className="hero-monitor-stage"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="hero-monitor-stage__glow" aria-hidden="true" />
      <div className="hero-monitor" role="group" aria-label="Prévia interativa fictícia do Nutriwork Plus em um monitor 3D">
        <div className="hero-monitor__frame">
          <div className="hero-monitor__screen">
            <HeroMonitorDemo />
          </div>
        </div>
        <div className="hero-monitor__neck" aria-hidden="true" />
        <div className="hero-monitor__base" aria-hidden="true" />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="inicio" className="hero">
      <div className="hero__eclipse" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <Reveal className="hero__layout">
        <div className="hero__content">
          <h1>Nutriwork<span>plus.</span></h1>
          <p>A plataforma feita para todo estudante de Nutrição.</p>
          <div className="hero-actions">
            <Button href="/#planos" variant="outline">Venha fazer parte</Button>
            <Button href="https://plus.gruponutriwork.com.br/" variant="outline" className="member-cta" external>Já sou membro(a)</Button>
          </div>
        </div>
        <HeroMonitor />
      </Reveal>
    </section>
  );
}

function Platform() {
  return (
    <section id="sobre" className="section platform-section">
      <div className="page-width">
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

function EstudeLandingHero() {
  return (
    <section className="section estude-page-hero">
      <div className="page-width">
        <Reveal className="estude-page-hero__grid">
          <div className="estude-page-hero__copy">
            <p className="eyebrow">Guia Estude</p>
            <h1>Estude com clareza, método e constância.</h1>
            <p>Um guia prático para transformar esforço em rendimento, organizar sua rotina e estudar com mais direção ao longo da graduação.</p>
            <div className="estude-page-hero__actions">
              <Button href={checkout.guide} external>Quero estudar melhor</Button>
            </div>
          </div>
          <div className="estude-page-hero__visual" aria-hidden="true">
            <img src="/assets/estude-phone.webp" alt="" />
            <span>rotina possível</span>
            <span>menos sobrecarga</span>
            <span>mais direção</span>
          </div>
        </Reveal>
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
          <div><p className="footer-label">Visite nossas redes sociais:</p><a className="contact-link" href="https://www.instagram.com/gruponutriwork" target="_blank" rel="noreferrer"><Icon name="instagram"/>@gruponutriwork</a></div>
          <div><h3>Dúvidas? Entre em contato.</h3><a className="contact-link" href={whatsappContact} target="_blank" rel="noreferrer"><Icon name="phone"/><span><small>WhatsApp</small>(12) 99750-5188</span></a><a className="contact-link" href={`mailto:${contactEmail}`}><Icon name="mail"/><span><small>E-mail</small>{contactEmail}</span></a></div>
        </div>
        <p className="copyright">© {new Date().getFullYear()} Nutriwork. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

function HomePage() {
  return <main><Hero/><ReferencesSection/><Platform/><Courses/><Extras/><Evidence/><Mentor/><Pricing/><FAQ/></main>;
}

function EstudePage() {
  return <main className="estude-page"><EstudeLandingHero/><Estude/><StudyBenefits/><EstudePlan/></main>;
}

function PartnersPage() {
  return (
    <main className="partners-page">
      <section className="section partners-hero">
        <div className="page-width">
          <Reveal className="partners-hero__grid">
            <div className="partners-hero__copy">
              <p className="eyebrow">Parcerias Nutriwork</p>
              <h1>Construa uma parceria com uma comunidade que valoriza ciência, formação e impacto real.</h1>
              <p>Projetos, marcas e instituições que compartilham uma visão séria de educação em saúde podem conversar com o Nutriwork para criar iniciativas consistentes e relevantes.</p>
              <div className="partners-hero__actions">
                <Button href={partnerForm} external>Quero ser parceiro</Button>
                <a className="partners-hero__contact" href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </div>
            </div>
            <Suspense fallback={<div className="partners-globe-card partners-globe-card--fallback" aria-hidden="true" />}>
              <PartnersGlobeCard />
            </Suspense>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const page = useCurrentPage();
  const { loading, renderedPage } = useLoadingExperience(page);
  useScrollReveal(renderedPage);
  useMobileCtaVisibility(renderedPage);
  useHashScroll(renderedPage);

  return (
    <>
      <LoadingExperience state={loading} />
      <div className={`app-shell ${loading.active ? 'app-shell--loading' : ''}`}>
        <Header/>
        {renderedPage === 'estude' ? <EstudePage/> : renderedPage === 'partners' ? <PartnersPage/> : <HomePage/>}
        <Footer/>
        {renderedPage === 'home' && <Button href="/#planos" className="mobile-cta">Ver planos</Button>}
      </div>
    </>
  );
}
