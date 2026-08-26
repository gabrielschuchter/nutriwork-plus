import type { Config } from 'vike/types';
import { SITE_URL } from '../../src/lib/news/site';

export default {
  prerender: true,
  ssr: false,
  title: 'Nutriwork Plus | Plataforma de estudos em Nutrição',
  description: 'Nutriwork Plus: formação em Nutrição com cursos organizados, comunidade, evidências científicas e o livro ESTUDE.',
  image: `${SITE_URL}/assets/og-nutriwork.jpg`
} satisfies Config;
