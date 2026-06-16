import { useEffect, useRef, useState } from 'react';
import './PlatformPreview.css';

/**
 * Prévia da plataforma Nutriwork Plus exibida no monitor da Home.
 * Reconstrói um dashboard premium (estilo SaaS de estudos): sidebar + header
 * com atalhos/notificações/perfil, boas-vindas com indicador de progresso, cards
 * de métricas, grade de cursos e painel de agenda/tarefas, com animações
 * discretas que dão "vida" à interface (rotação de destaque, barras animadas,
 * hover e transições).
 *
 * Componente isolado e reutilizável: escala proporcionalmente ao container
 * (container queries) e acompanha os temas light/dark do site, sem valores
 * fixos dependentes de breakpoint.
 */

type View = 'inicio' | 'cursos' | 'agenda' | 'suporte';
type IconName = 'home' | 'book' | 'play' | 'calendar' | 'headset' | 'instagram' | 'search' | 'bell' | 'check' | 'arrow' | 'clock' | 'flame' | 'trophy' | 'chart';

const navItems: Array<{ id: View; label: string; icon: IconName }> = [
  { id: 'inicio', label: 'Início', icon: 'home' },
  { id: 'cursos', label: 'Meus cursos', icon: 'book' },
  { id: 'agenda', label: 'Agenda', icon: 'calendar' },
  { id: 'suporte', label: 'Suporte', icon: 'headset' },
];

const kpis: Array<{ label: string; value: string; hint: string; icon: IconName; progress?: number }> = [
  { label: 'Aulas aplicadas', value: '12', hint: '+3 na semana', icon: 'trophy' },
  { label: 'Tempo útil', value: '28h', hint: 'na prática', icon: 'clock' },
  { label: 'Progresso real', value: '72%', hint: 'trilha ativa', icon: 'chart', progress: 72 },
  { label: 'Sequência', value: '12 dias', hint: 'sem perder ritmo', icon: 'flame' },
];

const courses = [
  { id: 'evidence', title: 'Nutrição Baseada em Evidências', category: 'Essencial', progress: 68, image: '/assets/course-evidence.jpg' },
  { id: 'clinical', title: 'Nutrição Clínica', category: 'Prática clínica', progress: 45, image: '/assets/course-clinical.jpg' },
  { id: 'sports', title: 'Nutrição Esportiva', category: 'Performance', progress: 27, image: '/assets/course-sports.jpg' },
  { id: 'behavior', title: 'Nutrição Comportamental', category: 'Adesão', progress: 34, image: '/assets/course-behavior.jpg' },
  { id: 'biochem', title: 'Bioquímica da Nutrição', category: 'Fundamentos', progress: 18, image: '/assets/course-biochemistry.jpg' },
  { id: 'intro', title: 'O começo: como estudar Nutrição', category: 'Trilha inicial', progress: 100, image: '/assets/course-intro.jpg' },
];

const agenda = [
  { time: 'Hoje · 19h', title: 'Aula ao vivo: decidir conduta sem achismo', tag: 'Aula' },
  { time: 'Qui · 20h', title: 'NWcast: rotina real de atendimento', tag: 'Podcast' },
  { time: 'Sáb · 10h', title: 'Mentoria de evidências aplicada', tag: 'Mentoria' },
];

const tasks = [
  { text: 'Retomar aula de conduta baseada em evidências', done: false },
  { text: 'Salvar checklist de primeira consulta', done: true },
  { text: 'Responder discussão de caso da semana', done: false },
];

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const monthDays = Array.from({ length: 30 }, (_, i) => i + 1); // junho/2026
const monthOffset = new Date(2026, 5, 1).getDay(); // alinha o dia 1
const today = 16;
const eventDays = new Set([16, 18, 22, 25]);

function PreviewIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, JSX.Element> = {
    home: <><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1Z" /></>,
    book: <><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5Z" /><path d="M19 18v3H6.5A1.5 1.5 0 0 1 5 19.5" /></>,
    play: <><circle cx="12" cy="12" r="9" /><path d="m10 9 5 3-5 3V9Z" /></>,
    calendar: <><rect x="4" y="5" width="16" height="16" rx="2.5" /><path d="M4 9h16M8 3v4M16 3v4" /></>,
    headset: <><path d="M5 13a7 7 0 0 1 14 0" /><rect x="3.5" y="13" width="3.5" height="6" rx="1.4" /><rect x="17" y="13" width="3.5" height="6" rx="1.4" /><path d="M20.5 19a3 3 0 0 1-3 3H13" /></>,
    instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.2 6.8h.01" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4-4" /></>,
    bell: <><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></>,
    check: <><path d="m4 12 5 5L20 6" /></>,
    arrow: <><path d="m9 6 6 6-6 6" /></>,
    clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>,
    flame: <><path d="M12 3c1 3-1.5 4-1.5 6.5A1.5 1.5 0 0 0 12 11a3 3 0 0 0 1.5-3C16 9.5 17 12 17 14a5 5 0 0 1-10 0c0-3 2.5-4.5 5-11Z" /></>,
    trophy: <><path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" /><path d="M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 20h6M12 13v4" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  };
  return (
    <svg className="pp-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Brand({ className = '' }: { className?: string }) {
  return <span className={`pp-wordmark ${className}`.trim()}>NUTRIWORK<i>+</i></span>;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);
  return reduced;
}

function ProgressRing({ value }: { value: number }) {
  const r = 15.5;
  const circumference = 2 * Math.PI * r;
  const dash = (value / 100) * circumference;
  return (
    <svg className="pp-ring" viewBox="0 0 36 36" role="img" aria-label={`Progresso geral ${value}%`}>
      <circle className="pp-ring__track" cx="18" cy="18" r={r} />
      <circle className="pp-ring__value" cx="18" cy="18" r={r} strokeDasharray={`${dash} ${circumference}`} transform="rotate(-90 18 18)" />
      <text className="pp-ring__text" x="18" y="19.5">{value}%</text>
    </svg>
  );
}

export default function PlatformPreview() {
  const [view, setView] = useState<View>('inicio');
  const [spotlight, setSpotlight] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(courses[0].id);
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  // "Vida" no sistema: alterna o card de curso em destaque automaticamente.
  useEffect(() => {
    if (reduced || view !== 'inicio') return;
    const id = window.setInterval(() => setSpotlight((value) => (value + 1) % Math.min(courses.length, 3)), 3000);
    return () => window.clearInterval(id);
  }, [reduced, view]);

  const headTitle: Record<View, string> = { inicio: 'Início', cursos: 'Meus cursos', agenda: 'Agenda', suporte: 'Suporte' };
  const openCourse = (courseId: string) => {
    setSelectedCourse(courseId);
    setView('cursos');
  };

  return (
    <div className="platform-preview" role="group" aria-label="Prévia do dashboard do Nutriwork Plus">
      <aside className="pp-sidebar">
        <div className="pp-brand">
          <Brand className="pp-brand__mark" />
          <small>Grupo de Estudos</small>
        </div>
        <nav className="pp-nav" aria-label="Navegação da plataforma">
          {navItems.map((item) => (
            <button key={item.id} type="button" className={view === item.id ? 'is-active' : ''} aria-pressed={view === item.id} onClick={() => setView(item.id)}>
              <PreviewIcon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
          <a className="pp-nav__external" href="https://www.instagram.com/gruponutriwork" target="_blank" rel="noreferrer">
            <PreviewIcon name="instagram" />
            <span>Instagram</span>
          </a>
        </nav>
        <div className="pp-user">
          <span className="pp-user__avatar">EN</span>
          <span className="pp-user__meta"><strong>Equipe Nutriwork</strong><small>Plano anual</small></span>
        </div>
      </aside>

      <div className="pp-shell">
        <header className="pp-header">
          <button type="button" className="pp-shortcut" onClick={() => openCourse(selectedCourse)}>
            <PreviewIcon name="play" />
            <span>Retomar aula prática</span>
          </button>
          <div className="pp-header__actions">
            <button type="button" className="pp-iconbtn" aria-label="Abrir agenda de notificações" onClick={() => setView('agenda')}><PreviewIcon name="bell" /><i className="pp-dot" /></button>
            <span className="pp-profile"><span className="pp-user__avatar">EN</span><span className="pp-profile__name">{headTitle[view]}</span></span>
          </div>
        </header>

        <main className="pp-main" key={view}>
          {view === 'inicio' && (
            <section className="pp-view" aria-label="Início">
              <article className="pp-welcome">
                <div className="pp-welcome__copy">
                  <span className="pp-eyebrow">Bem-vindo(a) de volta</span>
                  <strong>Sua evolução continua hoje</strong>
                  <p>Estudo prático, evidências e decisões clínicas organizadas para caber na rotina.</p>
                  <button type="button" className="pp-btn" onClick={() => setView('cursos')}><PreviewIcon name="play" /> Retomar estudos</button>
                </div>
                <div className="pp-welcome__ring"><ProgressRing value={72} /><span>trilha aplicada</span></div>
              </article>

              <div className="pp-kpis">
                {kpis.map((kpi) => (
                  <article className="pp-kpi" key={kpi.label}>
                    <span className="pp-kpi__icon"><PreviewIcon name={kpi.icon} /></span>
                    <span className="pp-kpi__label">{kpi.label}</span>
                    <strong className="pp-kpi__value">{kpi.value}</strong>
                    {kpi.progress != null
                      ? <span className="pp-bar pp-bar--anim" style={{ ['--p' as string]: `${kpi.progress}%` }}><i /></span>
                      : <span className="pp-kpi__hint">{kpi.hint}</span>}
                  </article>
                ))}
              </div>

              <div className="pp-columns">
                <section className="pp-block">
                  <div className="pp-section__head"><h3>Continue assistindo</h3><button type="button" className="pp-link" onClick={() => setView('cursos')}>Ver tudo</button></div>
                  <div className="pp-rail" ref={railRef}>
                    {courses.slice(0, 3).map((course, index) => (
                      <CourseCard key={course.id} course={course} spotlight={!reduced && index === spotlight} active={course.id === selectedCourse} onOpen={() => openCourse(course.id)} />
                    ))}
                  </div>
                </section>

                <aside className="pp-side">
                  <MiniCalendar />
                  <AgendaList />
                </aside>
              </div>
            </section>
          )}

          {view === 'cursos' && (
            <section className="pp-view" aria-label="Meus cursos">
              <header className="pp-view__head"><h2>Meus cursos</h2><p>Sua trilha completa de Nutrição.</p></header>
              <div className="pp-grid pp-grid--courses">
                {courses.map((course) => <CourseCard key={course.id} course={course} active={course.id === selectedCourse} onOpen={() => setSelectedCourse(course.id)} />)}
              </div>
            </section>
          )}

          {view === 'agenda' && (
            <section className="pp-view" aria-label="Agenda">
              <header className="pp-view__head"><h2>Agenda</h2><p>Próximos eventos e lembretes.</p></header>
              <div className="pp-columns pp-columns--agenda">
                <MiniCalendar />
                <div className="pp-side">
                  <AgendaList />
                  <TaskList />
                </div>
              </div>
            </section>
          )}

          {view === 'suporte' && (
            <section className="pp-view pp-support" aria-label="Suporte">
              <header className="pp-view__head"><h2>Suporte</h2><p>Precisa de ajuda? A equipe responde rápido.</p></header>
              <div className="pp-support__cards">
                <article><span className="pp-kpi__icon"><PreviewIcon name="headset" /></span><strong>Central de ajuda</strong><p>Dúvidas sobre acesso, módulos e trilhas.</p></article>
                <article><span className="pp-kpi__icon"><PreviewIcon name="play" /></span><strong>Como começar</strong><p>Siga o módulo “O começo” e ative sua trilha.</p></article>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function CourseCard({ course, spotlight = false, active = false, onOpen }: { course: typeof courses[number]; spotlight?: boolean; active?: boolean; onOpen: () => void }) {
  return (
    <article className={`pp-course pp-course--${course.id} ${spotlight ? 'is-spotlight' : ''} ${active ? 'is-active' : ''}`}>
      <span className="pp-course__cover" style={{ backgroundImage: `linear-gradient(180deg, rgba(8, 16, 34, .08), rgba(6, 12, 28, .58)), url(${course.image})` }}><Brand className="pp-course__brand" /></span>
      <div className="pp-course__body">
        <span className="pp-course__cat">{course.category}</span>
        <strong className="pp-course__title">{course.title}</strong>
        <span className="pp-bar pp-bar--anim" style={{ ['--p' as string]: `${course.progress}%` }}><i /></span>
        <div className="pp-course__foot">
          <span>{course.progress}%</span>
          <button type="button" className="pp-btn pp-btn--sm" onClick={onOpen}>{course.progress === 100 ? 'Revisar' : active ? 'Aberto' : 'Continuar'}<PreviewIcon name="arrow" /></button>
        </div>
      </div>
    </article>
  );
}

function MiniCalendar() {
  return (
    <article className="pp-calendar">
      <div className="pp-calendar__head"><PreviewIcon name="calendar" /><strong>Junho 2026</strong></div>
      <div className="pp-calendar__grid">
        {weekDays.map((day, index) => <span key={`w${index}`} className="pp-calendar__wd">{day}</span>)}
        {Array.from({ length: monthOffset }, (_, i) => <span key={`o${i}`} />)}
        {monthDays.map((day) => (
          <span key={day} className={`pp-calendar__day ${day === today ? 'is-today' : ''} ${eventDays.has(day) ? 'has-event' : ''}`}>{day}</span>
        ))}
      </div>
    </article>
  );
}

function AgendaList() {
  return (
    <article className="pp-agenda">
      <div className="pp-section__head"><h3>Próximas aulas</h3></div>
      <ul>
        {agenda.map((item) => (
          <li key={item.title}>
            <span className="pp-agenda__time">{item.time}</span>
            <span className="pp-agenda__title">{item.title}</span>
            <span className="pp-agenda__tag">{item.tag}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function TaskList() {
  return (
    <article className="pp-tasks">
      <div className="pp-section__head"><h3>Lembretes</h3></div>
      <ul>
        {tasks.map((task) => (
          <li key={task.text} className={task.done ? 'is-done' : ''}>
            <span className="pp-tasks__check">{task.done && <PreviewIcon name="check" />}</span>
            {task.text}
          </li>
        ))}
      </ul>
    </article>
  );
}
