import MiniSearch from 'minisearch';
import { NEWS_CATEGORY_LABELS } from './constants';
import type { NewsArticle } from './types';

type SearchDocument = {
  id: string;
  title: string;
  tags: string;
  summary: string;
  category: string;
  body: string;
};

export function normalizeNewsSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')
    .trim();
}

export function createNewsSearch(articles: NewsArticle[]) {
  const search = new MiniSearch<SearchDocument>({
    fields: ['title', 'tags', 'summary', 'category', 'body'],
    storeFields: ['id'],
    searchOptions: {
      boost: {
        title: 6,
        tags: 4,
        summary: 2,
        category: 2,
        body: 1
      },
      prefix: true,
      fuzzy: 0.2
    }
  });

  search.addAll(articles.map((article) => ({
    id: article.slug,
    title: normalizeNewsSearch(article.title),
    tags: normalizeNewsSearch(article.tags.join(' ')),
    summary: normalizeNewsSearch(article.summary),
    category: normalizeNewsSearch(`${article.category} ${NEWS_CATEGORY_LABELS[article.category]}`),
    body: normalizeNewsSearch(article.plainText)
  })));

  return search;
}

export function searchNews(search: MiniSearch<SearchDocument>, query: string) {
  const normalizedQuery = normalizeNewsSearch(query);
  if (!normalizedQuery) return [];

  return search.search(normalizedQuery, {
    boost: {
      title: 6,
      tags: 4,
      summary: 2,
      category: 2,
      body: 1
    },
    prefix: true,
    fuzzy: 0.2
  }).map((result) => result.id);
}
