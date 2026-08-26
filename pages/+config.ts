import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

export default {
  extends: [vikeReact],
  prerender: true,
  stream: true,
  lang: 'pt-BR',
  viewport: 'responsive',
  favicon: '/assets/favicon-nutriwork.png',
  htmlAttributes: {
    'data-theme': 'light',
    style: 'color-scheme: light'
  }
} satisfies Config;
