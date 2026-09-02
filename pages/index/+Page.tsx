import App from '../../src/App';
import { NewsClientHead } from '../../src/components/news/NewsClientHead';
import { SITE_URL } from '../../src/lib/news/site';

export default function Page() {
  return <>
    <NewsClientHead
      title="Nutriwork Plus | Plataforma de estudos em Nutrição"
      description="Nutriwork Plus: formação em Nutrição com cursos organizados, comunidade, evidências científicas e o livro ESTUDE."
      canonicalUrl={`${SITE_URL}/`}
      imageUrl={`${SITE_URL}/assets/og-nutriwork.jpg`}
      openGraphType="website"
    />
    <App />
  </>;
}
