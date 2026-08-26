import { useEffect, useState } from 'react';
import { navItems } from '../../data';

type Theme = 'light' | 'dark';

function ThemeIcon({ name }: { name: 'sun' | 'moon' }) {
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === 'sun' ? <><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></> : <path d="M20.7 15.2A8.6 8.6 0 0 1 8.8 3.3 9 9 0 1 0 20.7 15.2Z"/>}
    </svg>
  );
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.add('theme-transition');
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f4f7fc' : '#02040a');
  try {
    localStorage.setItem('nutriwork-theme', theme);
  } catch {
    // Theme selection remains available when storage is unavailable.
  }
  window.setTimeout(() => root.classList.remove('theme-transition'), 350);
}

export function NewsHeader() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const currentTheme = document.documentElement.dataset.theme;
    setTheme(currentTheme === 'dark' ? 'dark' : 'light');
  }, []);

  const nextTheme = theme === 'dark' ? 'light' : 'dark';

  return (
    <header className="site-header">
      <a className="brand" href="/#inicio" aria-label="Nutriwork Plus, voltar ao início">NUTRIWORK<span>+</span></a>
      <nav className={`nav ${open ? 'nav--open' : ''}`} aria-label="Navegação principal">
        {navItems.map((item) => {
          const active = item.href === '/noticias';
          return <a key={item.href} className={active ? 'is-active' : undefined} href={item.href} aria-current={active ? 'page' : undefined} onClick={() => setOpen(false)}>{item.label}</a>;
        })}
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" type="button" aria-label={`Tema atual: ${theme === 'dark' ? 'escuro' : 'claro'}. Alternar para tema ${nextTheme === 'dark' ? 'escuro' : 'claro'}.`} title={`Alternar para tema ${nextTheme === 'dark' ? 'escuro' : 'claro'}`} onClick={() => {
          applyTheme(nextTheme);
          setTheme(nextTheme);
        }}>
          <span className="theme-toggle__track" aria-hidden="true">
            <span className="theme-toggle__icon theme-toggle__icon--sun"><ThemeIcon name="sun"/></span>
            <span className="theme-toggle__icon theme-toggle__icon--moon"><ThemeIcon name="moon"/></span>
            <span className="theme-toggle__thumb"><ThemeIcon name={theme === 'dark' ? 'moon' : 'sun'}/></span>
          </span>
        </button>
        <button className="menu-button" type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span/><span/><span/>
        </button>
      </div>
    </header>
  );
}
