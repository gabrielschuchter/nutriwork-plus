import type { NewsCategory, NewsType } from './constants';

export type NewsReference = {
  citation: string;
  url: string;
};

export type NewsCallToAction = {
  label: string;
  url: string;
};

export type NewsArticle = {
  slug: string;
  title: string;
  summary: string;
  type: NewsType;
  category: NewsCategory;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage: string;
  coverAlt: string;
  featured: boolean;
  draft: boolean;
  references: NewsReference[];
  callToAction?: NewsCallToAction;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  content: string;
  plainText: string;
  readingTimeMinutes: number;
};
