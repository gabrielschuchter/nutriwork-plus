export type PricingPlanId = 'monthly' | 'quarterly' | 'semiannual' | 'annual';

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
      cashMonthlyEquivalent: string;
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
    cashPrice: '39,90',
    checkoutUrl: 'https://pay.kiwify.com.br/pO6p0QM'
  },
  quarterly: {
    id: 'quarterly',
    title: 'Trimestral',
    accessMonths: 3,
    billing: 'term',
    cashPrice: '92,70',
    installments: { count: 3, value: '33,08' },
    cashMonthlyEquivalent: '30,90',
    checkoutUrl: 'https://pay.kiwify.com.br/TbFu6TD?split=3'
  },
  semiannual: {
    id: 'semiannual',
    title: 'Semestral',
    accessMonths: 6,
    billing: 'term',
    cashPrice: '149,40',
    installments: { count: 6, value: '28,03' },
    cashMonthlyEquivalent: '24,90',
    checkoutUrl: 'https://pay.kiwify.com.br/bfYt1Pt?split=6'
  },
  annual: {
    id: 'annual',
    title: 'Nutriwork Plus Anual +',
    subtitle: 'livro ESTUDE!',
    description: 'Acesso completo à formação que você sempre quis.',
    accessMonths: 12,
    billing: 'term',
    cashPrice: '298,80',
    installments: { count: 12, value: '30,90' },
    cashMonthlyEquivalent: '24,90',
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

export const platformPlanIds = ['monthly', 'quarterly', 'semiannual'] as const satisfies readonly PricingPlanId[];
