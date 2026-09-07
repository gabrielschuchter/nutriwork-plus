import { useState } from 'react';
import { navItems } from '../../data';

export function NewsHeader() {
  const [open, setOpen] = useState(false);

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
        <button className="menu-button" type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <span/><span/><span/>
        </button>
      </div>
    </header>
  );
}
