"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { DASHBOARD_PERIODS, type DashboardPeriod } from "@/lib/api/dashboard-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PeriodSelectorProps {
  value: DashboardPeriod;
}

export default function PeriodSelector({ value }: PeriodSelectorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string | null) {
    if (!next) return;
    startTransition(() => {
      const params = new URLSearchParams();
      if (next !== "CURRENT_MONTH") params.set("period", next);
      const query = params.toString();
      router.push(`/${query ? `?${query}` : ""}`);
      router.refresh();
    });
  }

  return (
    <Select value={value} onValueChange={handleChange} disabled={isPending}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {DASHBOARD_PERIODS.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
