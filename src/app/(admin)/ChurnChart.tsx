"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ChurnPointResponse } from "@/lib/api/dashboard-types";

interface ChurnChartProps {
  points: ChurnPointResponse[];
}

const MONTH_LABELS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const pctFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

export default function ChurnChart({ points }: ChurnChartProps) {
  const data = points.map((p) => ({
    label: `${MONTH_LABELS[p.month - 1]}/${String(p.year).slice(2)}`,
    pct: p.churnRatePct,
    canceled: p.canceled,
    activeAtStart: p.activeAtStart,
  }));

  if (data.length === 0 || data.every((d) => d.activeAtStart === 0)) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Sem dado suficiente para calcular churn nos últimos 12 meses.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value: number) => `${pctFormatter.format(value)}%`}
          />
          <Tooltip
            cursor={{ stroke: "var(--accent)" }}
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value, _name, item) => {
              const pct = typeof value === "number" ? value : 0;
              const payload = (item?.payload ?? {}) as { canceled?: number; activeAtStart?: number };
              return [
                `${pctFormatter.format(pct)}% (${payload.canceled ?? 0}/${payload.activeAtStart ?? 0})`,
                "Churn",
              ];
            }}
          />
          <Line
            type="monotone"
            dataKey="pct"
            stroke="var(--destructive)"
            strokeWidth={2}
            dot={{ r: 3, fill: "var(--destructive)" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
