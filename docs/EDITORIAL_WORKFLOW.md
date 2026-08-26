# Nutriwork Notícias — workflow editorial

## Regra principal

Trabalhe na branch `feature/noticias-mvp`. Não publique, faça merge ou force push diretamente na `main`. A `main` continua sendo produção e deve receber somente uma alteração revisada e aprovada.

## Criar ou editar no Pages CMS

1. Acesse [app.pagescms.org](https://app.pagescms.org/).
2. Entre com a conta do GitHub.
3. Autorize apenas o repositório necessário.
4. Abra `gabrielschuchter/nutriwork-plus`.
5. Selecione a branch `feature/noticias-mvp`.
6. Abra a coleção **Nutriwork Notícias**.
7. Crie uma publicação ou abra uma existente.
8. Preencha título, resumo, tipo, categoria, tags, autor, data, capa, alt e conteúdo.
9. Salve e confira o commit criado na branch selecionada.
10. Confira o build e o preview da branch; somente depois de revisão humana uma mudança pode seguir para a `main`.

## Campos e regras

- O nome do arquivo é criado a partir do título e define a URL. Não crie um campo `slug` separado.
- Use uma categoria principal e tags específicas. Elas alimentam filtros, busca e relacionados.
- Selecione `Lançamento` para uma nova oferta ou produto, `Campanha` para uma comunicação com período definido e `Evento` para encontro, aula ou live. Os formatos continuam usando a mesma URL de artigo e a mesma revisão editorial.
- A imagem de capa vai para `public/noticias` e o CMS grava a URL pública no frontmatter.
- O texto alternativo deve descrever objetivamente a imagem.
- O corpo aceita Markdown pelo editor rich-text, incluindo títulos, listas, links, tabelas e imagens.
- Referências são opcionais, mas devem conter citação e URL quando usadas.
- Para lançamento, campanha ou evento, preencha o CTA editorial com o destino verdadeiro. Para eventos, preencha ao menos a data; horário e local/formato dão contexto ao card e ao artigo. Nunca publique placeholders, páginas de checkout não aprovadas ou data de evento não confirmada.
- `draft: true` é o padrão seguro para uma nova entrada: ela não aparece publicamente em nenhuma superfície.
- Marque `draft: false` somente quando a publicação estiver revisada.
- O rascunho `modelo-interno-de-evento-ao-vivo.md` é apenas uma referência de preenchimento. Duplique ou adapte sua estrutura, troque todos os dados e só então publique uma nova entrada aprovada.
- `featured: true` candidata o artigo ao destaque. Caso haja vários, vence o mais recente por data de publicação.
- Preencha `updatedAt` apenas quando a atualização editorial for relevante.

## Publicação e correções

Cada salvamento no Pages CMS é um commit Git. A publicação depende do build estático passar; erros de frontmatter, Markdown vazio ou capa inexistente interrompem o build de propósito.

Para corrigir uma entrada, edite-a no CMS e salve outro commit. Para desfazer uma versão, use o histórico/revert do GitHub. Não reescreva histórico e não use force push.

## Revisão antes da main

Antes de propor merge, confira o preview da branch em desktop e mobile, busque pelo título e por termos sem acento, abra a URL individual e confirme que `draft` permanece invisível. O CMS é a camada de edição, não uma aprovação automática de conteúdo clínico ou editorial.
