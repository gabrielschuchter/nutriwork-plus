# Nutriwork Plus

Landing page oficial do Nutriwork Plus, reconstruida em React, TypeScript e Vite com foco em fidelidade visual, responsividade, acessibilidade e performance.

## Desenvolvimento

```bash
npm ci
npm run dev -- --host 0.0.0.0
```

O Vite exibira no terminal o endereco local da aplicacao.

## Build de producao

```bash
npm run build
npm run preview
```

Os arquivos de producao sao gerados em `dist/client/`.

## Nutriwork Notícias

O portal editorial estático fica em `/noticias`; as publicações são arquivos Markdown em `content/noticias` e são editáveis pelo Pages CMS na branch correta. Consulte:

- [Arquitetura](docs/NOTICIAS_ARCHITECTURE.md)
- [Workflow editorial](docs/EDITORIAL_WORKFLOW.md)
- [Checklist de QA](docs/NOTICIAS_QA.md)
- [Notas de implementação](docs/NOTICIAS_IMPLEMENTATION_NOTES.md)

## Deploy na Vercel

1. Importe este repositorio na Vercel.
2. Mantenha o framework detectado como `Vite`.
3. Use `npm run build` como Build Command.
4. Use `dist/client` como Output Directory (também configurado em `vercel.json`).

Novos commits na branch `main` publicam automaticamente quando o projeto esta conectado ao repositorio.
