import { SITE_URL } from '../../src/lib/news/site';

export function Head() {
  return <>
    <link rel="canonical" href={`${SITE_URL}/`} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={`${SITE_URL}/`} />
  </>;
}
