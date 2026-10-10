import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

export default {
  extends: [vikeReact],
  prerender: true,
  stream: true,
  lang: 'pt-BR',
  viewport: 'responsive',
  favicon: '/assets/favicon-nutriwork.png',
  bodyHtmlEnd: '<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1516307990311398&ev=PageView&noscript=1" /></noscript>',
  htmlAttributes: {
    'data-theme': 'light',
    style: 'color-scheme: light'
  }
} satisfies Config;
