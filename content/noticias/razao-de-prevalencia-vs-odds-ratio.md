---
title: "Razão de prevalência e odds ratio: qual é a diferença?"
summary: "Razão de prevalência e odds ratio não são sinônimos: medem quantidades diferentes, respondem a desenhos diferentes e podem levar a interpretações muito distintas quando o desfecho é frequente."
type: "explicador"
category: "ciencia-pbe"
tags:
  - "epidemiologia"
  - "razão de prevalência"
  - "odds ratio"
  - "regressão logística"
author: "Equipe Nutriwork"
publishedAt: "2026-08-24"
updatedAt: "2026-08-26"
coverImage: "/assets/noticias/razao-prevalencia-odds-ratio.jpg"
coverAlt: "Capa do curso Bioquímica da Nutrição do Nutriwork com imagem de moléculas em tons de azul"
featured: false
draft: true
references:
  - citation: "Barros AJD, Hirakata VN. Alternatives for logistic regression in cross-sectional studies: an empirical comparison of models that directly estimate the prevalence ratio. BMC Med Res Methodol. 2003;3:21."
    url: "https://doi.org/10.1186/1471-2288-3-21"
  - citation: "Greenland S. Noncollapsibility, confounding, and sparse-data bias. Part 2: What should researchers make of persistent controversies about the odds ratio? J Clin Epidemiol. 2021;139:264-268."
    url: "https://doi.org/10.1016/j.jclinepi.2021.06.004"
  - citation: "Deeks JJ, Higgins JPT, Altman DG, et al. Chapter 10: Analysing data and undertaking meta-analyses. Cochrane Handbook for Systematic Reviews of Interventions."
    url: "https://training.cochrane.org/handbook/current/chapter-10"
---

Razão de prevalência (RP) e *odds ratio* (OR) são medidas relativas, mas **não medem a mesma quantidade**. O erro mais comum é interpretar um OR como se ele dissesse diretamente quantas vezes a prevalência ou o risco é maior em um grupo.

## Prevalência, odds e suas razões

Se a prevalência de um desfecho é `p`, as *odds* são:

`odds = p / (1 - p)`

Assim, se 20 de 100 pessoas apresentam o desfecho:

- prevalência = 20/100 = **0,20**;
- odds = 20/80 = **0,25**.

Para comparar dois grupos:

- **RP = p₁ / p₀**;
- **OR = [p₁/(1-p₁)] / [p₀/(1-p₀)]**.

| Medida | Comparação |
| --- | --- |
| Razão de prevalência | prevalência em um grupo ÷ prevalência no outro |
| Odds ratio | odds em um grupo ÷ odds no outro |

## O mesmo conjunto de dados pode produzir números bem diferentes

Imagine 100 pessoas em cada grupo:

- grupo A: 40 com o desfecho;
- grupo B: 20 com o desfecho.

A prevalência é 40% versus 20%:

- **RP = 0,40 / 0,20 = 2,0**.

As odds são 40/60 no grupo A e 20/80 no grupo B:

- **OR = (40/60) / (20/80) ≈ 2,67**.

Dizer que o grupo A tem “2,67 vezes a prevalência” seria incorreto. A prevalência é duas vezes maior; as **odds** são 2,67 vezes maiores.

Quando a associação é protetora, o OR também tende a se afastar mais de 1. Por exemplo, prevalências de 10% e 20% geram RP = 0,50 e OR ≈ 0,44. Portanto, é mais preciso dizer que o OR tende a apresentar uma associação **mais distante do valor nulo** do que a RP quando ambos são calculados a partir dos mesmos riscos, e não simplesmente que ele sempre “superestima” numericamente a outra medida.

## E a regra do “desfecho raro”?

Quando as probabilidades são pequenas, `p` e `p/(1-p)` ficam próximas. Nessa situação, OR e medidas baseadas em risco podem ter valores semelhantes.

Mas “raro” não é uma chave binária. A proximidade depende do risco basal e da magnitude da associação. Não existe um ponto universal abaixo do qual seja sempre seguro trocar OR por RP ou risco relativo.

A regra útil é simples: **se o artigo reportou OR, interprete OR como OR**. Se for importante comunicar em risco ou prevalência, faça uma transformação apropriada usando um risco basal explícito, em vez de apenas trocar o nome da medida.

## O desenho do estudo muda o que pode ser estimado

### Estudos transversais

Quando o objetivo é comparar prevalências, a RP costuma ser mais diretamente interpretável. Modelos log-binomial ou Poisson com variância robusta são alternativas usadas para estimar RP ajustada.

A regressão logística, por outro lado, estima OR. Usar regressão logística não autoriza chamar o resultado de RP.

### Coortes e ensaios

Quando o desfecho é observado ao longo de um período, pode-se estimar risco relativo, diferença de riscos, razão de taxas ou outras medidas, dependendo de como tempo e eventos foram definidos.

O OR continua sendo matematicamente válido como medida de efeito, inclusive em ensaios, mas costuma ser menos intuitivo para comunicação clínica quando riscos absolutos podem ser apresentados diretamente.

### Estudos de caso-controle

Em um estudo de caso-controle convencional, o número de casos e controles é definido pelo esquema de amostragem. Por isso, não se pode recuperar diretamente a prevalência ou o risco do desfecho apenas a partir da proporção de casos da amostra.

O OR é natural nesse desenho. Dependendo do esquema de amostragem, ele pode ter interpretações epidemiológicas específicas. Em amostragem por densidade de incidência, por exemplo, o OR pode estimar uma razão de taxas sem depender da chamada “suposição de doença rara”. Isso mostra por que a relação entre OR e risco relativo não deve ser ensinada apenas como uma regra de aproximação para eventos raros.

## Ajustar por covariáveis não torna OR e RP equivalentes

Há ainda uma diferença estatística importante: o OR é **não colapsável**.

Isso significa que um OR ajustado pode diferir de um OR não ajustado mesmo quando a covariável adicionada não é um fator de confusão. Portanto, a diferença entre OR bruto e ajustado não deve ser automaticamente interpretada como “quantidade de confundimento removida”.

Essa propriedade é uma das razões pelas quais comparações diretas entre ORs de modelos com diferentes conjuntos de covariáveis exigem cautela.

## Não pare na medida relativa

Mesmo uma RP ou OR perfeitamente calculada não informa o impacto absoluto.

Considere dois cenários com RP = 2,0:

- risco basal de 1% → 2%; diferença absoluta = 1 ponto percentual;
- risco basal de 30% → 60%; diferença absoluta = 30 pontos percentuais.

A mesma medida relativa pode corresponder a consequências muito diferentes.

Por isso, uma leitura clínica mais completa procura:

1. medida relativa correta;
2. intervalo de confiança;
3. risco ou prevalência basal;
4. efeito absoluto;
5. período de seguimento, quando houver;
6. risco de viés e aplicabilidade.

A pergunta não é “RP ou OR: qual é melhor?”. A pergunta é **qual medida corresponde ao desenho, ao estimando de interesse e à forma mais transparente de comunicar o efeito**.
