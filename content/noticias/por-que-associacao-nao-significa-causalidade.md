---
title: "Por que associação não significa causalidade?"
summary: "Associação descreve um padrão nos dados; inferência causal exige uma pergunta causal explícita, um desenho capaz de aproximá-la e pressupostos que tornem a comparação entre estratégias interpretável."
type: "explicador"
category: "ciencia-pbe"
tags:
  - "causalidade"
  - "associação"
  - "inferência causal"
  - "viés"
author: "Equipe Nutriwork"
publishedAt: "2026-08-22"
updatedAt: "2026-08-26"
coverImage: "/assets/noticias/associacao-causalidade.jpg"
coverAlt: "Capa do curso Introdução à Nutrição do Nutriwork com mãos escrevendo e alimentos em primeiro plano"
featured: false
draft: true
references:
  - citation: "Hernán MA. The C-Word: Scientific Euphemisms Do Not Improve Causal Inference From Observational Data. Am J Public Health. 2018;108:616-619."
    url: "https://doi.org/10.2105/AJPH.2018.304337"
  - citation: "Hernán MA, Robins JM. Using Big Data to Emulate a Target Trial When a Randomized Trial Is Not Available. Am J Epidemiol. 2016;183:758-764."
    url: "https://doi.org/10.1093/aje/kwv254"
  - citation: "Sterne JAC, Hernán MA, McAleenan A, Reeves BC, Higgins JPT. Chapter 25: Assessing risk of bias in a non-randomized study. Cochrane Handbook for Systematic Reviews of Interventions."
    url: "https://training.cochrane.org/handbook/current/chapter-25"
---

Uma **associação** é uma relação estatística entre variáveis: a distribuição de um desfecho difere conforme os níveis de uma exposição, intervenção ou característica. Essa descrição pode ser correta mesmo quando a relação não é causal.

Já uma afirmação causal responde a outra pergunta: **o que aconteceria com o desfecho se, em uma mesma população-alvo, comparássemos estratégias ou exposições alternativas bem definidas?**

Essa diferença parece simples, mas muda completamente como um estudo deve ser desenhado, analisado e interpretado.

## Associação não é uma etapa “menor” da causalidade

Nem toda pesquisa pretende estimar efeito causal.

Uma associação pode ser útil para:

- predição de risco;
- prognóstico;
- vigilância epidemiológica;
- identificação de grupos com maior ocorrência de um desfecho;
- descrição de padrões populacionais.

Nesses casos, o objetivo pode ser associacional ou preditivo e não há necessidade de transformar o achado em uma intervenção hipotética.

O problema surge quando um estudo estima uma associação, mas a conclusão passa a sugerir que **mudar a exposição mudaria o desfecho** sem justificar essa interpretação.

## Para falar em efeito, primeiro defina a pergunta causal

Uma boa análise causal começa antes do modelo estatístico.

É preciso especificar, entre outros elementos:

- população elegível;
- estratégias ou exposições comparadas;
- momento em que a comparação começa;
- período de seguimento;
- desfecho;
- contraste causal de interesse;
- plano de análise.

Em estudos observacionais de intervenções, pensar em qual seria o **ensaio-alvo (*target trial*)** ajuda a tornar essas escolhas explícitas e a evitar problemas como desalinhamento entre elegibilidade, início do tratamento e início do seguimento.

## O que pode produzir uma associação sem o efeito causal de interesse?

### Confundimento

Ocorre quando causas comuns da exposição e do desfecho tornam os grupos sistematicamente diferentes antes da comparação.

Ajustar “muitas variáveis” não resolve automaticamente o problema. É preciso ajustar as variáveis adequadas para o estimando causal de interesse. Controlar mediadores ou colisores pode, inclusive, introduzir viés.

### Viés de seleção

A forma como participantes entram, permanecem ou são analisados pode criar uma associação diferente daquela existente na população-alvo. Perdas de seguimento, seleção condicionada por consequências da exposição e alguns tipos de amostragem podem produzir esse problema.

### Erro de mensuração

Classificar mal exposição, desfecho ou covariáveis pode deslocar a estimativa em direções difíceis de prever. Mais participantes não corrigem uma medida sistematicamente ruim.

### Temporalidade e causalidade reversa

Se exposição e desfecho são medidos no mesmo momento, pode ser impossível estabelecer qual ocorreu primeiro. Em outras situações, sinais iniciais do próprio desfecho podem modificar a exposição antes do diagnóstico formal.

### Erros de desenho e de tempo zero

Definir elegibilidade em um momento, exposição em outro e iniciar o seguimento depois pode gerar vieses como o *immortal time bias*. Esses problemas não são resolvidos apenas por regressão multivariada.

## Quais pressupostos permitem uma interpretação causal?

Em linguagem de inferência causal, a identificação de um efeito a partir de dados observacionais geralmente depende de pressupostos como:

- **consistência:** a intervenção ou exposição está suficientemente bem definida para relacionar a estratégia observada ao resultado potencial correspondente;
- **troca ou permutabilidade (*exchangeability*):** após o controle apropriado, os grupos comparados seriam comparáveis quanto aos resultados potenciais;
- **positividade:** existem participantes com probabilidade diferente de zero de receber cada estratégia relevante em todos os estratos necessários à comparação;
- mensuração e modelos suficientemente adequados para o estimando proposto.

Esses pressupostos não podem ser “provados” apenas olhando o valor de *p* ou a saída de um software.

## Então estudos observacionais nunca permitem inferência causal?

Não.

A frase “estudo observacional só mostra associação” é uma simplificação excessiva. Muitas perguntas causais não podem ou não devem ser respondidas por ensaios randomizados, e inferências causais podem ser construídas a partir de dados observacionais quando a pergunta, o desenho, os pressupostos e a análise são explicitados e defendidos.

O ponto não é proibir linguagem causal. É exigir que ela seja **compatível com o objetivo e com as condições necessárias para identificar o efeito**.

## Randomização também não elimina toda crítica

Um ensaio randomizado bem conduzido protege fortemente contra confundimento basal porque a alocação aleatória favorece comparabilidade entre grupos. Ainda assim, resultados de ensaios podem sofrer viés por:

- desvios das intervenções atribuídas;
- dados de desfecho ausentes;
- mensuração inadequada do desfecho;
- seleção do resultado reportado;
- problemas no processo de randomização.

Por isso, ferramentas como o RoB 2 avaliam risco de viés de um **resultado específico**, e não concedem um selo automático de validade a todo estudo randomizado.

## Como avaliar uma alegação causal com mais rigor

Ao encontrar a frase “X causa Y”, pergunte:

1. Qual é exatamente o efeito causal que se pretende estimar?
2. As estratégias comparadas são bem definidas?
3. A exposição antecede o desfecho e o tempo zero foi alinhado?
4. Quais causas comuns de exposição e desfecho precisam ser controladas?
5. Alguma variável ajustada pode ser mediadora ou colisor?
6. Seleção, perdas ou mensuração podem explicar parte do resultado?
7. A análise respeita o desenho e o estimando de interesse?
8. Existem análises de sensibilidade, controles negativos ou outras estratégias para explorar viés residual?
9. Evidências obtidas por métodos com vieses diferentes apontam para a mesma direção — isto é, existe triangulação?

> A significância estatística não identifica causalidade, e o ajuste estatístico não substitui um desenho causal coerente.

A leitura moderna não é simplesmente “correlação não é causalidade”. É perguntar **qual efeito está sendo estimado, em quais pressupostos a interpretação causal depende e quão plausíveis esses pressupostos são diante do desenho e dos dados disponíveis**.
