# Nutriwork Notícias — notas de implementação

## Base auditada

- Branch base: `main` no commit `57b58d75fa8e53cc04d25bf159fb63d62e0283c6` (`fix(pricing): align plans with Kiwify installments`).
- Stack encontrada: React 18.3.1, TypeScript 5.6.3, Vite 5.4.x e deploy estático Vercel.
- Roteamento anterior: a home e as páginas internas usam hash (`/#/estude`, `/#/parceiros`) dentro de `src/App.tsx`.
- Tema anterior: `data-theme` no elemento `html`, persistido em `localStorage` sob `nutriwork-theme`; a mesma chave e os mesmos tokens CSS foram preservados.
- Header/Footer: definidos no `src/App.tsx`; Notícias preserva markup/classes e tokens visuais equivalentes para não reescrever a landing monolítica.
- Vercel anterior: saída padrão `dist` com redirect permanente `/estude → /`.

## Decisões confirmadas pelo spike

1. Vike atual e Content Collections atual não são compatíveis com o stack sem upgrades relevantes.
2. `vike@0.4.230` falhou em Vite 5 por importar `createBuilder`; a combinação que passou foi `vike@0.4.220` + `vike-react@0.5.10`.
3. O Vike compatível requer `vike({ prerender: true })` no plugin e `stream: true` para permitir `<Head>` em páginas React SSG. O script de desenvolvimento usa o Vite diretamente, pois esta versão do wrapper `vike dev` não aceita encaminhar `--host`; o plugin do Vike continua carregado pelo mesmo `vite.config.ts`.
4. Content Collections atual requer Vite 6+, então o fallback usado é `gray-matter` + Zod dentro de um plugin Vite tipado e validado.
5. O build gera o site em `dist/client`; `vercel.json` foi ajustado sem remover o redirect legado.
6. O MVP também comporta publicações institucionais de lançamento, campanha e evento, com CTA e agenda opcionais. Como nenhum anúncio aprovado foi fornecido, foi incluído apenas um modelo `draft` interno; nenhuma novidade fictícia foi exposta ao público.
7. A versão compatível do `vike-react` usa `<Head>` somente no HTML do servidor. Para não deixar title, canonical e OpenGraph da página anterior durante navegação interna, `NewsClientHead` atualiza essas tags no navegador e mantém o title em sincronia com o roteador.

## Arquivos preservados deliberadamente

- `src/data/pricing.ts`: valores e URLs Kiwify não foram alterados.
- Seções comerciais, planos, FAQ, CTA mobile e componentes legados da home.
- Assets existentes em `public/assets`; as publicações demonstrativas os reutilizam como capas em vez de recriar identidade visual.
- Redirect `/estude → /`.

## Limites conhecidos

- O conteúdo demonstrativo é evergreen e não equivale a publicação editorial aprovada.
- Não houve deploy, merge ou alteração de produção nesta implementação.
- O preview autenticado da Vercel e o login real no Pages CMS exigem uma conta humana autorizada; a configuração e o fluxo estão documentados.
- A busca é client-side para o corpus inicial; a evolução sugerida é Pagefind quando o volume justificar.
