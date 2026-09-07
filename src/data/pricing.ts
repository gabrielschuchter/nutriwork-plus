export type PricingPlanId = 'monthly' | 'quarterly' | 'annual';

export type InstallmentCondition = {
  count: number;
  value: string;
};

type PricingPlanBase = {
  id: PricingPlanId;
  title: string;
  subtitle?: string;
  description?: string;
  accessMonths: number;
  cashPrice: string;
  checkoutUrl: string;
  featured?: boolean;
  benefits?: readonly string[];
};

export type PricingPlan =
  | (PricingPlanBase & {
      billing: 'monthly';
      installments?: never;
      cashMonthlyEquivalent?: never;
    })
  | (PricingPlanBase & {
      billing: 'term';
      installments: InstallmentCondition;
    });

type PricingPlanCatalog = {
  [PlanId in PricingPlanId]: PricingPlan & { id: PlanId };
};

export const checkoutLinks = {
  estude: 'https://pay.kiwify.com.br/fPEAkDX'
} as const;

export const estudeProduct = {
  cashPrice: '77,90',
  checkoutUrl: checkoutLinks.estude
} as const;

export const pricingPlans = {
  monthly: {
    id: 'monthly',
    title: 'Mensal',
    accessMonths: 1,
    billing: 'monthly',
    cashPrice: '49,90',
    checkoutUrl: 'https://pay.kiwify.com.br/pO6p0QM'
  },
  quarterly: {
    id: 'quarterly',
    title: 'Trimestral',
    accessMonths: 3,
    billing: 'term',
    cashPrice: '129,90',
    installments: { count: 3, value: '46,36' },
    checkoutUrl: 'https://pay.kiwify.com.br/TbFu6TD?split=3'
  },
  annual: {
    id: 'annual',
    title: 'Nutriwork Plus Anual',
    description: 'Acesso completo à formação que você sempre quis.',
    accessMonths: 12,
    billing: 'term',
    cashPrice: '398,00',
    installments: { count: 12, value: '41,16' },
    checkoutUrl: 'https://pay.kiwify.com.br/nyBH9vq?split=12',
    featured: true,
    benefits: [
      'Cursos de todas as áreas da Nutrição.',
      'E-book ESTUDE para resolver sua rotina de estudos.',
      'Aulas ao vivo com especialistas.',
      'Comunidade ativa para trocar dúvidas e obter oportunidades de trabalho.',
      'Análises de artigo, podcasts, Espaço de Conforto e outros recursos.'
    ]
  }
} satisfies PricingPlanCatalog;

export const platformPlanIds = ['annual', 'quarterly', 'monthly'] as const satisfies readonly PricingPlanId[];
