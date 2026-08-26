export const SITE_URL = 'https://gruponutriwork.com.br';

export function absoluteNewsUrl(path: string) {
  return new URL(path, SITE_URL).toString();
}
