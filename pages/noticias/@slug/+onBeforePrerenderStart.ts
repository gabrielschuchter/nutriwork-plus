import { publicArticles } from '../../../src/lib/news/articles';

export function onBeforePrerenderStart() {
  return publicArticles.map((article) => `/noticias/${article.slug}`);
}
