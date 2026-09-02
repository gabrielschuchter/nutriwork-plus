import { useState } from 'react';
import { absoluteNewsUrl } from '../../lib/news/site';

type ShareActionsProps = {
  slug: string;
  title: string;
  summary: string;
};

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  if (!copied) throw new Error('The browser did not allow copying the link.');
}

function ShareIcon({ name }: { name: 'share' | 'copy' }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === 'share' ? <><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/></> : <><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></>}</svg>;
}

export function ShareActions({ slug, title, summary }: ShareActionsProps) {
  const [status, setStatus] = useState('');
  const fallbackUrl = absoluteNewsUrl(`/noticias/${slug}`);

  const copyLink = async () => {
    try {
      await copyToClipboard(window.location.href || fallbackUrl);
      setStatus('Link copiado para a área de transferência.');
    } catch {
      setStatus('Não foi possível copiar o link neste navegador.');
    }
  };

  const share = async () => {
    if (!navigator.share) {
      await copyLink();
      return;
    }

    try {
      await navigator.share({ title, text: summary, url: window.location.href || fallbackUrl });
      setStatus('Compartilhamento concluído.');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      await copyLink();
    }
  };

  return (
    <div className="news-share" aria-label="Compartilhar publicação">
      <span>Compartilhar</span>
      <div className="news-share__actions">
        <button type="button" onClick={() => void share()}><ShareIcon name="share"/>Compartilhar</button>
        <button type="button" onClick={() => void copyLink()}><ShareIcon name="copy"/>Copiar link</button>
      </div>
      <span className="sr-only" aria-live="polite">{status}</span>
    </div>
  );
}
