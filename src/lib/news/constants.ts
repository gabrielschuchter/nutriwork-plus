export const NEWS_TYPES = ['noticia', 'analise', 'explicador', 'nutriwork', 'conteudo-do-dia', 'lancamento', 'campanha', 'evento'] as const;
export const NEWS_CATEGORIES = ['ciencia-pbe', 'clinica', 'esportiva', 'comportamento', 'carreira', 'nutriwork'] as const;

export type NewsType = typeof NEWS_TYPES[number];
export type NewsCategory = typeof NEWS_CATEGORIES[number];

export const NEWS_TYPE_LABELS: Record<NewsType, string> = {
  noticia: 'Notícia',
  analise: 'Análise',
  explicador: 'Explicador',
  nutriwork: 'Nutriwork',
  'conteudo-do-dia': 'Conteúdo do dia',
  lancamento: 'Lançamento',
  campanha: 'Campanha',
  evento: 'Evento'
};

export const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
  'ciencia-pbe': 'Ciência e PBE',
  clinica: 'Clínica',
  esportiva: 'Esportiva',
  comportamento: 'Comportamento',
  carreira: 'Carreira',
  nutriwork: 'Nutriwork'
};
