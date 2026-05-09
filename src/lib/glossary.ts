export interface GlossaryTerm {
  id: string;
  label: string;
  category: "billing" | "catalog" | "subscription" | "customer";
  description: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: "bundle",
    label: "Bundle",
    category: "catalog",
    description:
      "Pacote comercial vendido para o profissional. Agrupa um conjunto de módulos por um preço único (mensal e anual). É a única coisa que aparece como ofertável no /pricing — módulos sozinhos não são vendidos.",
  },
  {
    id: "addon",
    label: "Add-on",
    category: "catalog",
    description:
      "Complemento opcional cobrado em cima de um bundle existente. Pode ser um módulo extra (DOX Financeiro), uma taxa percentual (DOX Pagamentos), um slot adicional ou um seat extra. Cliente só pode contratar add-on se já tiver bundle ativo.",
  },
  {
    id: "module",
    label: "Módulo",
    category: "catalog",
    description:
      "Unidade técnica de funcionalidade (reports, customers, forms, calendar, ai_light, ai_pro, tracking, payments, financial, files_ocr). Sempre faz parte de um bundle ou add-on — nunca é vendido isolado.",
  },
  {
    id: "highlighted",
    label: "Destaque",
    category: "catalog",
    description:
      "Marca o bundle como 'Mais escolhido' / 'Recomendado' em /pricing. Ganha selo visual + CTA azul. Convenção: marcar apenas 1 bundle como highlighted.",
  },
  {
    id: "seats",
    label: "Seats",
    category: "subscription",
    description:
      "Número de profissionais que podem usar a conta simultaneamente. Solo/Plus/Pro = 1, Clínica = 3 inclusos. Add-on extra_seat aumenta esse número (apenas Clínica).",
  },
  {
    id: "tracking",
    label: "Tracking",
    category: "subscription",
    description:
      "Slots de pacientes em acompanhamento contínuo (formulários diários, gráficos de evolução). Pro = 3 inclusos, Clínica = 5. Add-on extra_tracking_slot adiciona slots a R$2,99 cada (qualquer bundle).",
  },
  {
    id: "module_addon",
    label: "Add-on tipo MODULE",
    category: "catalog",
    description:
      "Add-on que ativa um módulo extra além dos do bundle (ex: DOX Financeiro como módulo independente). Cobrado mensal fixo via priceMonthlyCents.",
  },
  {
    id: "slot_quota_addon",
    label: "Add-on tipo SLOT_QUOTA",
    category: "catalog",
    description:
      "Add-on que aumenta uma quota (ex: +1 slot de tracking). Cobrança por unidade via priceUnitCents × quantidade.",
  },
  {
    id: "seat_quota_addon",
    label: "Add-on tipo SEAT_QUOTA",
    category: "catalog",
    description:
      "Add-on que aumenta a quota de profissionais ativos (apenas Clínica). priceUnitCents × quantidade extra.",
  },
  {
    id: "percentage_fee_addon",
    label: "Add-on tipo PERCENTAGE_FEE",
    category: "catalog",
    description:
      "Add-on cobrado como % do GMV transacionado (ex: DOX Pagamentos 1,5% do que o profissional recebe via PIX/Boleto/Cartão pelos pacientes). priceMonthlyCents = 0, feePercentage define a alíquota.",
  },
  {
    id: "target_module",
    label: "Módulo alvo",
    category: "catalog",
    description:
      "Em add-ons MODULE ou SLOT_QUOTA, qual módulo é ativado/expandido. Ex: extra_tracking_slot tem targetModuleId='tracking'.",
  },
  {
    id: "available_for_bundles",
    label: "Disponível em",
    category: "catalog",
    description:
      "Lista de bundles que podem contratar esse add-on. Ex: extra_seat só aparece se cliente é Clínica.",
  },
  {
    id: "bundle_price",
    label: "Bundle Price",
    category: "billing",
    description:
      "Versão imutável do preço de um bundle no momento da assinatura (price_monthly + price_yearly + seats + tracking_slots). Mudança de preço cria nova versão e expira a anterior. Subscription guarda referência para versão exata — clientes vigentes não são afetados por reajustes.",
  },
  {
    id: "subscription",
    label: "Subscription",
    category: "subscription",
    description:
      "Assinatura ativa do tenant. value_cents = snapshot do valor cobrado, status (TRIAL, ACTIVE, GRACE, SUSPENDED, CANCEL_PENDING, CANCELED), billing_cycle (MONTHLY, QUARTERLY, SEMIANNUALLY, YEARLY), bundle_price_id apontando pra versão exata do bundle.",
  },
  {
    id: "trial",
    label: "Trial",
    category: "subscription",
    description:
      "Período de 14 dias com 5 módulos liberados (Plus). Único por tenant — uma vez consumido, nunca mais. Após D+14 sem método de pagamento: TRIAL_GRACE 24h → BLOCKED.",
  },
  {
    id: "grace",
    label: "Grace",
    category: "subscription",
    description:
      "Período de tolerância após pagamento atrasado. Cliente mantém acesso por X dias enquanto regulariza. Após o grace expirar → SUSPENDED.",
  },
  {
    id: "cycle",
    label: "Ciclo de cobrança",
    category: "billing",
    description:
      "Periodicidade da cobrança. MONTHLY (cobra todo mês via cartão recorrente), QUARTERLY/SEMIANNUALLY/YEARLY (cobrança única antecipada via PIX ou cartão one-time). DOX não aceita boleto.",
  },
  {
    id: "billing_type",
    label: "Método de pagamento",
    category: "billing",
    description:
      "Forma como a cobrança é feita: CREDIT_CARD (sempre, recorrência mensal ou one-time anual) ou PIX (apenas para planos não-mensais — cobrança única). BOLETO não é suportado.",
  },
  {
    id: "promotion",
    label: "Promoção",
    category: "billing",
    description:
      "Cupom ou campanha que aplica desconto sobre bundle + add-ons. 12 tipos (COUPON, BUNDLE, GRANT, REFERRAL, LOYALTY, WINBACK, CAMPAIGN, PARTNER, TRIAL_EXTENSION, VOLUME_DISCOUNT, CROSS_SELL, ANNIVERSARY). 3 durações: ONCE, FOREVER, FIXED_MONTHS.",
  },
  {
    id: "founding",
    label: "Founding 100",
    category: "billing",
    description:
      "Promoção dos 100 primeiros clientes — 30% off por 24 meses (FIXED_MONTHS). Após expirar, ativa automaticamente FOUNDING24M (LOYALTY 20% off perpétuo) via next_promotion_id.",
  },
  {
    id: "tenant",
    label: "Tenant",
    category: "customer",
    description:
      "Conta de cliente DOX (profissional autônomo ou clínica). Cada tenant tem schema próprio no Postgres (`_<uuid>`), sua subscription, seus pacientes, seus relatórios.",
  },
  {
    id: "vertical",
    label: "Vertical",
    category: "customer",
    description:
      "Domínio profissional do tenant (HEALTH, LEGAL, EDUCATION, ENGINEERING, ACCOUNTING, etc.). Definido no cadastro, define a label dinâmica de Cliente/Paciente e templates default.",
  },
  {
    id: "mrr",
    label: "MRR",
    category: "billing",
    description:
      "Monthly Recurring Revenue. Soma das assinaturas ativas normalizada para mensal (anual÷12, trimestral÷3, etc.) + add-ons mensais. Indicador-chave de saúde do negócio.",
  },
  {
    id: "arr",
    label: "ARR",
    category: "billing",
    description: "Annual Recurring Revenue = MRR × 12. Projeção anual da receita recorrente atual.",
  },
  {
    id: "churn",
    label: "Churn",
    category: "billing",
    description:
      "Taxa de cancelamento mensal (% de assinaturas ativas no início do mês que viraram CANCELED). Indicador inverso de retenção.",
  },
  {
    id: "ltv",
    label: "LTV",
    category: "billing",
    description:
      "Lifetime Value — quanto um cliente médio gera em receita ao longo do tempo. Estimado como ARPU ÷ taxa de churn mensal.",
  },
];

export function findTerm(id: string): GlossaryTerm | undefined {
  return GLOSSARY.find((t) => t.id === id);
}
