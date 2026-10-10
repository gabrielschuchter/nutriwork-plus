import type { PageContextClient } from 'vike/types';

export function onPageTransitionEnd(pageContext: PageContextClient) {
  if (!pageContext.isClientSideNavigation) return;

  const fbq = (window as Window & {
    fbq?: (command: string, event: string) => void;
  }).fbq;

  fbq?.('track', 'PageView');
}
