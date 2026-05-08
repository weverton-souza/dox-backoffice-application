import type { MethodRevenueResponse } from "@/lib/api/dashboard";
import type { BillingType } from "@/lib/api/tenants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyCents } from "@/lib/formatters";

interface MethodDistributionProps {
  rows: MethodRevenueResponse[];
}

const METHOD_LABEL: Record<BillingType, string> = {
  PIX: "PIX",
  BOLETO: "Boleto",
  CREDIT_CARD: "Cartão",
  UNDEFINED: "Não definido",
};

const METHOD_COLOR: Record<BillingType, string> = {
  PIX: "bg-success",
  BOLETO: "bg-warning",
  CREDIT_CARD: "bg-brand-500",
  UNDEFINED: "bg-muted-foreground",
};

export default function MethodDistribution({ rows }: MethodDistributionProps) {
  const total = rows.reduce((sum, r) => sum + r.totalCents, 0);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Receita por método de pagamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Sem pagamentos no período.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {rows.map((row) => {
              const pct = total > 0 ? (row.totalCents / total) * 100 : 0;
              return (
                <li key={row.billingType} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-foreground">{METHOD_LABEL[row.billingType]}</span>
                    <span className="text-muted-foreground">
                      {formatCurrencyCents(row.totalCents)}{" "}
                      <span className="text-xs">({row.paymentCount})</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full ${METHOD_COLOR[row.billingType]}`}
                      style={{ width: `${pct.toFixed(1)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
