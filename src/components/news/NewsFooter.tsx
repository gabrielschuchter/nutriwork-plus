const contactEmail = 'equipenutriwork@gmail.com';
const whatsappContact = `https://wa.me/5512997505188?text=${encodeURIComponent('Olá, equipe Nutriwork! Vim pelo site e gostaria de tirar uma dúvida sobre o Nutriwork Plus.')}`;

function FooterIcon({ name }: { name: 'instagram' | 'whatsapp' | 'mail' }) {
  const icon = name === 'instagram'
    ? <><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></>
    : name === 'whatsapp'
      ? <path fill="currentColor" stroke="none" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.82c2.16 0 4.19.84 5.72 2.37a8.04 8.04 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.1 8.09a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.46 3.63-8.09 8.1-8.09Zm-3.34 4.4c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32 .98 2.48c.12.16 1.7 2.6 4.12 3.65.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.43-.59 1.63-1.15.2-.56.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.64-1.2-1.42-1.34-1.66-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41-.14-.01-.3-.01-.46-.01Z"/>
      : <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>;

  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon}</svg>;
}

export function NewsFooter() {
  return (
    <footer id="contatos" className="footer news-footer">
      <div className="footer-orbit" aria-hidden="true" />
      <div className="page-width">
        <div className="footer-statement">
          <h2>A plataforma feita para <span className="footer-word-swap"><span className="footer-word-swap__strike">todo</span><span className="footer-word-swap__insert">você,</span></span> estudante de Nutrição.</h2>
        </div>
        <div className="footer-grid">
          <div className="footer-social">
            <p className="footer-label">Acompanhe de perto</p>
            <a className="contact-link contact-link--featured" href="https://www.instagram.com/gruponutriwork" target="_blank" rel="noreferrer"><FooterIcon name="instagram"/><span><small>Instagram</small>@gruponutriwork</span></a>
          </div>
          <div className="footer-contact">
            <p className="footer-label">Canais de contato</p>
            <h3>Dúvidas, acesso ou próximos passos? Fale com a equipe.</h3>
            <div className="footer-contact__links">
              <a className="contact-link" href={whatsappContact} target="_blank" rel="noreferrer"><FooterIcon name="whatsapp"/><span><small>WhatsApp</small>(12) 99750-5188</span></a>
              <a className="contact-link" href={`mailto:${contactEmail}`} aria-label={`Enviar e-mail para ${contactEmail}`}><FooterIcon name="mail"/><span><small>E-mail</small>{contactEmail}</span></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} Nutriwork. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
