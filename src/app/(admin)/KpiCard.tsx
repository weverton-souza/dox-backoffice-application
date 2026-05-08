import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import type { KpiCardResponse } from "@/lib/api/dashboard-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Format = "currency" | "count";

interface KpiCardProps {
  title: string;
  icon: LucideIcon;
  data: KpiCardResponse;
  format: Format;
  hint?: string;
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const countFormatter = new Intl.NumberFormat("pt-BR");

const pctFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
  signDisplay: "always",
});

function formatValue(value: number, format: Format): string {
  if (format === "currency") return currencyFormatter.format(value / 100);
  return countFormatter.format(value);
}

export default function KpiCard({ title, icon: Icon, data, format, hint }: KpiCardProps) {
  const trend = data.delta === 0 ? "flat" : data.delta > 0 ? "up" : "down";
  const TrendIcon = trend === "flat" ? Minus : trend === "up" ? ArrowUpRight : ArrowDownRight;
  const trendClass =
    trend === "flat"
      ? "text-muted-foreground"
      : trend === "up"
        ? "text-success"
        : "text-danger";

  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div className="text-2xl font-semibold tracking-tight text-foreground">
          {formatValue(data.current, format)}
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-medium", trendClass)}>
          <TrendIcon className="h-3.5 w-3.5" />
          <span>
            {data.deltaPct !== null
              ? `${pctFormatter.format(data.deltaPct)}%`
              : data.delta !== 0
                ? `${data.delta > 0 ? "+" : ""}${countFormatter.format(data.delta)}`
                : "—"}
          </span>
          <span className="font-normal text-muted-foreground">
            vs anterior {hint ? `· ${hint}` : ""}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
