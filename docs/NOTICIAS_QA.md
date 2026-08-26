# Nutriwork Notícias — QA reproduzível

## Build e arquivos estáticos

```bash
npm ci
npm run build
```

- [ ] A checagem TypeScript da app e da configuração de build passa.
- [ ] `dist/client/noticias/index.html` existe.
- [ ] Cada artigo público tem `dist/client/noticias/<slug>/index.html`.
- [ ] O HTML de um artigo contém título, corpo, description, canonical, OG e JSON-LD.
- [ ] `dist/client/sitemap.xml` lista `/noticias` e artigos públicos, sem drafts.

## Conteúdo

- [ ] Um frontmatter inválido interrompe o build.
- [ ] Uma capa inexistente interrompe o build.
- [ ] A publicação mais recente com `featured: true` é o destaque.
- [ ] Sem featured, a publicação pública mais recente vira destaque.
- [ ] `draft: true` não aparece em lista, busca, relacionados, rota pré-renderizada, sitemap ou bundle público.
- [ ] Um `evento` sem `eventDate`, horário fora de `HH:MM` ou CTA sem URL válida interrompe o build.
- [ ] Uma publicação de lançamento, campanha ou evento exibe o tipo correto; quando preenchidos, CTA e dados de agenda aparecem no artigo.

## Portal e artigo

- [ ] Abra `/noticias` diretamente e recarregue.
- [ ] Confirme destaque, cards, autor, data, categoria e tempo de leitura.
- [ ] Busque título completo e parcial.
- [ ] Busque sem acento: `cognicao` deve localizar conteúdo com `cognição`.
- [ ] Faça uma busca com pequeno erro e confirme resultado fuzzy.
- [ ] Combine filtro de categoria com busca e limpe ambos.
- [ ] Confirme estado vazio.
- [ ] Abra ao menos dois artigos diretamente, recarregue e use o breadcrumb para voltar.
- [ ] Confirme Markdown com headings, lista, citação, tabela, links e imagem.
- [ ] Confirme referências, relacionados, CTA e botões de compartilhar/copiar link.
- [ ] Abra uma URL de slug inexistente em dev/preview e confirme a tela 404 da aplicação.

## Tema, teclado e layout

- [ ] Teste claro e escuro em `/noticias` e em um artigo.
- [ ] Use Tab para alcançar skip link, menu, busca, filtros, cards e share; foco deve ficar visível.
- [ ] Teste em 320px, 768px, 1024px e 1440px sem rolagem horizontal.

## Regressão

- [ ] Home permanece em `/`.
- [ ] `/#/estude` e `/#/parceiros` continuam acessíveis.
- [ ] Preços, planos e URLs Kiwify foram conferidos sem alteração.
- [ ] Hero, FAQ, Header, menu mobile, Footer e CTA mobile continuam funcionais.
- [ ] O redirect existente `/estude → /` permanece em `vercel.json`.

## Servidor local

```bash
npm run dev -- --host 0.0.0.0
```

- [ ] A URL local responde.
- [ ] `/noticias` e pelo menos dois artigos são verificados no navegador.
- [ ] Console não mostra erros relevantes nem imagens 404.
