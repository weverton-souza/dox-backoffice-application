"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

const TABS: { value: string; label: string }[] = [
  { value: "PENDING", label: "Pendentes" },
  { value: "APPROVED", label: "Aprovadas" },
  { value: "REJECTED", label: "Rejeitadas" },
  { value: "ALL", label: "Todas" },
];

interface Props {
  current: string;
}

export default function StatusFilter({ current }: Props) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1 text-xs">
      {TABS.map((tab) => {
        const params = new URLSearchParams();
        if (tab.value !== "PENDING") params.set("status", tab.value);
        const query = params.toString();
        const href = `/students${query ? `?${query}` : ""}`;
        return (
          <Link
            key={tab.value}
            href={href}
            className={cn(
              "rounded-md px-3 py-1 transition-colors",
              current === tab.value ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
