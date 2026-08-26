import type { Config } from 'vike/types';
import { SITE_URL } from '../../src/lib/news/site';

export default {
  prerender: true,
  title: 'Nutriwork Notícias | Nutrição baseada em evidências',
  description: 'Explicadores, análises e atualizações do Nutriwork para estudar Nutrição com leitura crítica e clareza.',
  image: `${SITE_URL}/assets/og-nutriwork.jpg`
} satisfies Config;
