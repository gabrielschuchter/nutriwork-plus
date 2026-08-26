---
title: "Como interpretar um intervalo de confiança"
summary: "Um guia para ler intervalos de confiança sem transformar uma estimativa em uma certeza que o estudo não oferece."
type: "explicador"
category: "ciencia-pbe"
tags:
  - "estatística"
  - "intervalo de confiança"
  - "leitura crítica"
author: "Equipe Nutriwork"
publishedAt: "2026-08-26"
updatedAt: "2026-08-26"
coverImage: "/assets/course-evidence.jpg"
coverAlt: "Capa do curso Nutrição Baseada em Evidências do Nutriwork sobre uma página de texto em inglês"
featured: true
draft: false
references:
  - citation: "Wasserstein RL, Lazar NA. The ASA Statement on p-Values: Context, Process, and Purpose. The American Statistician. 2016."
    url: "https://doi.org/10.1080/00031305.2016.1154108"
  - citation: "Greenland S, Senn SJ, Rothman KJ, et al. Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations. European Journal of Epidemiology. 2016."
    url: "https://doi.org/10.1007/s10654-016-0149-3"
---

Um intervalo de confiança (IC) é uma forma de apresentar uma estimativa com a sua incerteza. Em vez de comunicar apenas um número — por exemplo, uma razão de prevalência de 1,30 — ele mostra uma faixa de valores compatíveis com os dados e com o método adotado.

Isso não transforma a leitura em automática. O IC ajuda quando é interpretado junto com a pergunta do estudo, o desfecho, o tamanho do efeito, o desenho e a qualidade das medidas.

> Um intervalo estreito costuma indicar maior precisão da estimativa; ele não prova, sozinho, que a estimativa está correta ou que o efeito importa na prática.

## Comece pela estimativa central

O primeiro número continua importante. Ele indica qual foi a melhor estimativa produzida pela análise. Depois, o intervalo mostra o quanto essa estimativa pode variar de acordo com a incerteza amostral.

| Resultado apresentado | Leitura inicial |
| --- | --- |
| Diferença média: 2,1 unidades (IC 95% 1,8 a 2,4) | A estimativa é positiva e relativamente precisa. |
| Razão: 1,30 (IC 95% 0,92 a 1,84) | Há incerteza que inclui a ausência de associação no parâmetro de referência. |
| Diferença média: 0,4 unidades (IC 95% -3,2 a 4,0) | A estimativa é pouco precisa e comporta efeitos em direções diferentes. |

O valor de referência depende da medida. Em diferenças, costuma ser zero. Em razões, costuma ser um. Quando o IC cruza esse valor, a análise não permite descartar a ausência de efeito sob aquele modelo e nível de confiança.

## O que “95%” quer dizer

Em termos frequencistas, um procedimento de IC de 95% produziria intervalos que incluem o parâmetro verdadeiro em 95% das repetições hipotéticas do mesmo estudo. Não significa que exista “95% de chance” de o parâmetro estar naquele intervalo específico.

Essa distinção parece abstrata, mas evita duas armadilhas comuns:

1. tratar o limite do intervalo como uma fronteira clínica automática;
2. concluir que resultados fora do IC são impossíveis.

O IC descreve incerteza estatística sob pressupostos. Viés de seleção, mensuração inadequada, confundimento e análise mal especificada não desaparecem porque o intervalo é estreito.

## Perguntas úteis ao ler um IC

Ao encontrar um intervalo de confiança, vale percorrer uma sequência curta:

- Qual é a medida e qual é seu valor de referência?
- O intervalo é compatível com efeitos clinicamente relevantes, mesmo que também inclua o nulo?
- A precisão é suficiente para a decisão que está sendo discutida?
- Há riscos de viés que o intervalo não consegue representar?
- A conclusão do artigo respeita a amplitude da incerteza?

![Forma abstrata azul em gradiente, usada como elemento visual do Nutriwork.](/assets/evidence-shape.webp)

## Precisão não é relevância

Um estudo grande pode gerar um IC muito estreito em torno de uma diferença pequena. Isso melhora a precisão, mas não responde sozinho se a diferença tem relevância para pacientes, serviços ou educação em saúde.

O contrário também acontece: um IC amplo não prova que não há efeito. Ele pode simplesmente indicar que os dados ainda não permitem distinguir, com precisão, entre cenários importantes.

Na leitura crítica, o IC é mais útil quando substitui a pergunta “deu significativo?” por “quais efeitos os dados deixam plausíveis e quão seguros estamos dessa estimativa?”.
