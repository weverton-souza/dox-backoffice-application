import type { ModuleRevenueResponse } from "@/lib/api/dashboard-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyCents } from "@/lib/formatters";
import { moduleDisplayName } from "@/lib/modules";

interface TopModulesListProps {
  rows: ModuleRevenueResponse[];
}

export default function TopModulesList({ rows }: TopModulesListProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Top módulos por MRR
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Sem módulos ativos pagantes.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row, index) => (
              <li key={row.moduleId} className="flex items-center justify-between gap-2 py-2.5">
                <div className="flex items-center gap-3">
                  <span className="w-5 text-xs font-mono text-muted-foreground">{index + 1}.</span>
                  <span className="text-sm font-medium text-foreground">
                    {moduleDisplayName(row.moduleId)}
                  </span>
                </div>
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-sm font-medium tabular-nums text-foreground">
                    {formatCurrencyCents(row.mrrCents)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {row.activeCount} ativo{row.activeCount === 1 ? "" : "s"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
