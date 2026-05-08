import { AlertTriangle } from "lucide-react";
import type { OverdueResponse } from "@/lib/api/dashboard-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyCents } from "@/lib/formatters";

interface OverdueCardProps {
  data: OverdueResponse;
}

export default function OverdueCard({ data }: OverdueCardProps) {
  const total = data.overdueCount + data.graceCount + data.suspendedCount;
  const danger = total > 0;

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Inadimplência</CardTitle>
        <AlertTriangle className={danger ? "h-4 w-4 text-danger" : "h-4 w-4 text-muted-foreground"} />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="text-2xl font-semibold tracking-tight text-foreground">
          {formatCurrencyCents(data.overdueAmountCents)}
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <Stat label="Vencidas" value={data.overdueCount} accent="danger" />
          <Stat label="Graça" value={data.graceCount} accent="warning" />
          <Stat label="Suspensas" value={data.suspendedCount} accent="danger" />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent: "danger" | "warning" }) {
  const colorClass = accent === "danger" ? "text-danger" : "text-warning";
  return (
    <div className="flex flex-col gap-0.5 rounded-md border border-border bg-card px-2 py-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={`text-base font-semibold ${value > 0 ? colorClass : "text-foreground"}`}>{value}</span>
    </div>
  );
}
