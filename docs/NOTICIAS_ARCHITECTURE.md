# Nutriwork Notícias — arquitetura implementada

## Objetivo

Nutriwork Notícias é uma área editorial pública, estática e indexável. O conteúdo é Markdown versionado no Git; não há banco, API de conteúdo, autenticação própria ou painel administrativo no site público.

O fluxo é intencionalmente simples: o editor altera um arquivo no Pages CMS, o GitHub registra o commit na branch correta, o build valida o conteúdo e a Vercel publica os arquivos estáticos.

## Arquitetura

```text
content/noticias/*.md
        │
        ▼
build/news-content-plugin.ts
  gray-matter + Zod + validação de capa
        │
        ├── virtual:nutriwork-news (dados tipados para React/MiniSearch)
        └── sitemap.xml (somente conteúdo público)
        │
        ▼
Vike + vike-react
  /                 SPA legada pré-renderizada como shell
  /noticias         SSG
  /noticias/:slug   SSG para cada artigo público
        │
        ▼
dist/client → Vercel static hosting
```

O `src/App.tsx` legado continua responsável pela home e pelos hash routes existentes (`/#/estude` e `/#/parceiros`). A área de Notícias usa URLs reais sem hash. O menu existente ganhou somente o link para `/noticias`.

## Conteúdo no Git

Cada arquivo em `content/noticias` tem nome em `kebab-case`; esse nome é o slug canônico. O frontmatter é validado com Zod e exige título, resumo, tipo, categoria, tags, autor, data, capa, alt, `featured` e `draft`. O corpo Markdown também não pode estar vazio.

Além dos explicadores e análises, o tipo editorial suporta `lancamento`, `campanha` e `evento`. Essas publicações podem receber `callToAction` (rótulo e URL) e, quando houver agenda, `eventDate`, `eventTime` e `eventLocation`. Um `evento` exige data; horários e locais sem data também fazem o build falhar. Há um modelo interno de evento em rascunho para o editor adaptar sem transformar informação não aprovada em conteúdo público.

O build falha para frontmatter inválido, slug inválido, corpo vazio ou capa que não exista em `public/`. `draft: true` continua sendo validado, mas é excluído do módulo público antes do bundle do navegador; portanto não entra em lista, busca, relacionados, rotas SSG, sitemap ou assets públicos.

O adapter atual do Content Collections (`@content-collections/vite@0.3.0`) requer Vite 6 ou superior. Como o site parte de Vite 5, foi aplicado o fallback previsto no briefing: `gray-matter` + Zod, encapsulados no plugin de conteúdo, mantendo schema, tipagem e validação em build.

## Routing e SSG

O spike verificou que a combinação atual de Vike exige cuidado com o stack existente. `vike@0.4.230` tenta usar `createBuilder`, API ausente no Vite 5. A versão compatível que passou no projeto é `vike@0.4.220` com `vike-react@0.5.10`, React 18 e Vite 5.

Essa versão usa a opção de compatibilidade `vike({ prerender: true })` no `vite.config.ts`, além de `stream: true` no `pages/+config.ts`. A raiz continua `ssr: false`; Notícias e seus artigos são renderizados em HTML durante `npm run build`. O conteúdo de um artigo está presente no arquivo `dist/client/noticias/<slug>/index.html` antes de qualquer JavaScript do navegador.

## Busca

MiniSearch é criado apenas no navegador usando publicações públicas. Os campos têm pesos decrescentes: título, tags, resumo/categoria e corpo. A consulta normaliza caixa e diacríticos em português, aceita prefixo e usa fuzzy moderado (`0.2`).

Essa decisão é adequada ao corpus inicial. Migrar para Pagefind deve ser considerado quando o número de publicações ou o peso do bundle tornar o índice em memória perceptível em dispositivos móveis.

## SEO e deploy

Cada artigo SSG recebe title, description, canonical, OpenGraph, Twitter e JSON-LD `BlogPosting` (ou `NewsArticle` apenas para o tipo editorial `noticia`). O plugin emite `sitemap.xml` sem drafts; `public/robots.txt` o referencia. Como o `<Head>` do `vike-react@0.5.10` é intencionalmente apenas HTML, `NewsClientHead` sincroniza title e tags mutáveis após navegação client-side, inclusive ao voltar para a landing, sem alterar a saída pré-renderizada.

`vercel.json` mantém o redirect existente de `/estude` e configura `dist/client` como `outputDirectory`. Não há Function ou runtime SSR para o conteúdo.

## Alternativas rejeitadas

- Banco/CMS próprio: aumentaria superfície de autenticação, operação e custo sem necessidade do MVP.
- Content Collections atual: incompatível com Vite 5 sem upgrade relevante do framework.
- Vike mais recente: exigiria Vite 6+ e a linha atual do `vike-react` exige React 19.
- Pagefind/Algolia: desnecessários para o corpus inicial e adicionariam complexidade operacional ou de build.
- Migração integral da landing: fora de escopo e arriscaria regressões em conversão e hash routes legados.
