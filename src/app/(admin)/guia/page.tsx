import { GLOSSARY, type GlossaryTerm } from "@/lib/glossary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CATEGORY_LABEL: Record<GlossaryTerm["category"], string> = {
  catalog: "Catálogo (bundles, add-ons, módulos)",
  subscription: "Assinatura (subscription, trial, grace)",
  billing: "Cobrança e métricas (preços, ciclos, MRR, churn)",
  customer: "Cliente (tenant, vertical)",
};

const CATEGORY_ORDER: GlossaryTerm["category"][] = [
  "catalog",
  "subscription",
  "billing",
  "customer",
];

export default function GuiaPage() {
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    terms: GLOSSARY.filter((t) => t.category === category),
  }));

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Guia de termos
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Referência dos termos usados pelo backoffice. Cada conceito que aparece nas
          tabelas e formulários tem um ícone <span className="font-mono">(?)</span>{" "}
          ao lado que abre a definição em tooltip; aqui está a lista completa pra consulta rápida.
        </p>
      </header>

      <div className="flex flex-col gap-6">
        {groups.map(({ category, terms }) => (
          <Card key={category} className="shadow-card">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {CATEGORY_LABEL[category]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="divide-y divide-border">
                {terms.map((t) => (
                  <div
                    key={t.id}
                    className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-[180px_1fr] sm:gap-4"
                  >
                    <dt className="text-sm font-semibold text-foreground">{t.label}</dt>
                    <dd className="text-sm leading-relaxed text-muted-foreground">
                      {t.description}
                    </dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
