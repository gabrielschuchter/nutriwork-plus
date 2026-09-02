---
title: "Como interpretar um intervalo de confiança"
summary: "Intervalos de confiança ajudam a quantificar a incerteza estatística, mas só fazem sentido quando lidos junto com a medida de efeito, os pressupostos da análise e limiares de importância clínica."
type: "explicador"
category: "ciencia-pbe"
tags:
  - "estatística"
  - "intervalo de confiança"
  - "leitura crítica"
  - "incerteza"
author: "Equipe Nutriwork"
publishedAt: "2026-08-26"
updatedAt: "2026-08-26"
coverImage: "/assets/noticias/intervalo-confianca.jpg"
coverAlt: "Capa do curso Nutrição Baseada em Evidências do Nutriwork sobre uma página de texto em inglês"
featured: false
draft: true
references:
  - citation: "Greenland S, Senn SJ, Rothman KJ, et al. Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations. Eur J Epidemiol. 2016;31:337-350."
    url: "https://doi.org/10.1007/s10654-016-0149-3"
  - citation: "Schünemann HJ, Vist GE, Higgins JPT, et al. Chapter 15: Interpreting results and drawing conclusions. Cochrane Handbook for Systematic Reviews of Interventions."
    url: "https://training.cochrane.org/handbook/current/chapter-15"
---

Um intervalo de confiança (IC) acompanha uma estimativa para mostrar quanta **incerteza estatística** existe em torno dela, dadas as informações observadas e os pressupostos usados na análise. Ele é muito mais informativo do que classificar um resultado apenas como “significativo” ou “não significativo”.

Mas o IC também é frequentemente interpretado de maneira errada. Ele não mede risco de viés, não informa diretamente a importância clínica do efeito e, em uma análise frequentista convencional, não significa que exista 95% de probabilidade de o verdadeiro efeito estar dentro daquele intervalo específico.

## Primeiro: identifique a estimativa e a escala

O ponto central é a **estimativa de efeito** calculada pelo modelo. O IC mostra uma faixa de valores relativamente compatíveis com os dados sob os pressupostos adotados.

O valor nulo depende da medida:

- diferenças de médias e diferenças de riscos: **0**;
- razões, como risco relativo, razão de prevalência e odds ratio: **1**.

Para medidas de razão, a interpretação é naturalmente multiplicativa. Por isso, distâncias em torno de 1 não devem ser lidas como se a escala fosse linear.

| Resultado | O que a leitura inicial permite dizer |
| --- | --- |
| Diferença média: 2,1 (IC 95% 1,8 a 2,4) | Os dados são compatíveis com uma diferença positiva e relativamente precisa sob o modelo. Ainda falta saber se 1,8 a 2,4 é clinicamente importante. |
| Razão de risco: 0,92 (IC 95% 0,74 a 1,15) | O intervalo inclui o nulo e também efeitos em direções diferentes. Não é correto resumir isso simplesmente como “não houve efeito”. |
| Diferença média: 0,4 (IC 95% -3,2 a 4,0) | Há grande imprecisão: os dados são compatíveis tanto com benefício quanto com dano de magnitudes potencialmente relevantes. |

## O que “95%” significa de fato

Em termos frequentistas, o nível de 95% é uma propriedade do **procedimento** usado para construir o intervalo. Se repetíssemos o processo de amostragem e análise muitas vezes sob as mesmas condições e os pressupostos fossem válidos, aproximadamente 95% dos intervalos produzidos cobririam o parâmetro verdadeiro.

Depois que um intervalo específico foi calculado, o parâmetro não “fica com 95% de chance” de estar ali. Essa interpretação probabilística exige outro enquadramento, como um intervalo de credibilidade bayesiano com um modelo e distribuição a priori explicitados.

## Cruzar o valor nulo não cria uma fronteira científica

Um erro comum é transformar o IC em um teste binário:

- se não cruza o nulo: “existe efeito”;
- se cruza o nulo: “não existe efeito”.

Essa leitura reproduz o mesmo problema da dicotomização por *p* < 0,05.

O que importa é perguntar **quais magnitudes de efeito continuam compatíveis com os dados**. Um intervalo pode excluir o nulo e conter apenas efeitos triviais. Em outro estudo, pode incluir o nulo e, ao mesmo tempo, conter benefícios e danos grandes o suficiente para mudar uma decisão.

Por isso, sempre que possível, compare o IC com limiares de importância clínica ou de decisão definidos previamente, e não apenas com zero ou um.

## Precisão não é validade

Um IC estreito indica maior precisão estatística na escala apropriada. Ele não garante que a estimativa esteja próxima da verdade.

O intervalo convencional geralmente não incorpora adequadamente incerteza decorrente de:

- viés de seleção;
- confundimento não controlado;
- erro de mensuração;
- perdas e dados ausentes;
- escolha seletiva de análises ou desfechos;
- especificação inadequada do modelo.

Um estudo enorme pode produzir um intervalo muito estreito ao redor de uma estimativa sistematicamente enviesada.

> Mais precisão reduz erro aleatório; não corrige erro sistemático.

## Em meta-análises, o IC também precisa de contexto

Em uma meta-análise de efeitos aleatórios, o IC ao redor do efeito combinado expressa principalmente a incerteza sobre o **efeito médio**. Ele não descreve sozinho quanto os efeitos verdadeiros podem variar entre diferentes contextos e estudos.

Quando há heterogeneidade relevante, um **intervalo de predição** pode ajudar a mostrar a faixa na qual o efeito de um novo contexto comparável pode se situar. Portanto, um IC estreito do efeito médio não significa necessariamente que o efeito seja consistente em todos os cenários.

## Um roteiro curto para interpretar melhor

Ao ler um IC, pergunte:

1. Qual é a medida de efeito e sua escala?
2. Qual é a estimativa pontual?
3. Quais magnitudes de efeito o intervalo ainda comporta?
4. O intervalo cruza algum limiar de importância clínica ou de decisão?
5. A precisão é suficiente para distinguir cenários que levariam a decisões diferentes?
6. Existem riscos de viés ou problemas de mensuração que o IC não representa?
7. A conclusão dos autores respeita toda essa incerteza ou reduz tudo a “significativo/não significativo”?

A interpretação mais útil de um intervalo de confiança não é perguntar apenas se ele contém o valor nulo. É entender **quais efeitos permanecem compatíveis com os dados, quão precisamente foram estimados e se essa incerteza é aceitável para a decisão em questão**.
