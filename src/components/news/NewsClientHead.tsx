import { useEffect } from 'react';
import { Config } from 'vike-react/Config';

type ArticleMeta = {
  publishedAt: string;
  modifiedAt: string;
  author: string;
  structuredData: string;
};

type NewsClientHeadProps = {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl: string;
  openGraphType: 'article' | 'website';
  article?: ArticleMeta;
  robots?: string;
};

function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
}

function removeMeta(attribute: 'name' | 'property', key: string) {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
}

function setCanonical(canonicalUrl: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement('link');
    element.rel = 'canonical';
    document.head.append(element);
  }
  element.href = canonicalUrl;
}

function setStructuredData(structuredData: string | undefined) {
  const existingScript = document.getElementById('news-article-structured-data') as HTMLScriptElement | null;
  if (!structuredData) {
    existingScript?.remove();
    return;
  }

  const script = existingScript ?? document.createElement('script');
  script.id = 'news-article-structured-data';
  script.type = 'application/ld+json';
  script.textContent = structuredData;
  if (!existingScript) document.head.append(script);
}

export function NewsClientHead({ title, description, canonicalUrl, imageUrl, openGraphType, article, robots = 'index, follow' }: NewsClientHeadProps) {
  useEffect(() => {
    const applyTitle = () => {
      if (document.title !== title) document.title = title;
    };
    const observer = new MutationObserver(applyTitle);

    applyTitle();
    observer.observe(document.head, { childList: true, characterData: true, subtree: true });
    const timeout = window.setTimeout(applyTitle, 0);

    return () => {
      window.clearTimeout(timeout);
      observer.disconnect();
    };
  }, [title]);

  useEffect(() => {
    setCanonical(canonicalUrl);
    setMeta('name', 'description', description);
    setMeta('name', 'robots', robots);
    setMeta('property', 'og:type', openGraphType);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', canonicalUrl);
    setMeta('property', 'og:image', imageUrl);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', imageUrl);

    if (article) {
      setMeta('property', 'article:published_time', article.publishedAt);
      setMeta('property', 'article:modified_time', article.modifiedAt);
      setMeta('property', 'article:author', article.author);
    } else {
      removeMeta('property', 'article:published_time');
      removeMeta('property', 'article:modified_time');
      removeMeta('property', 'article:author');
    }

    setStructuredData(article?.structuredData);
  }, [article, canonicalUrl, description, imageUrl, openGraphType, robots, title]);

  return <Config title={title} />;
}
