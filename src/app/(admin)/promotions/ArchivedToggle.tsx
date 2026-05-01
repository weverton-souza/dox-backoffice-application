"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  includeArchived: boolean;
}

export default function ArchivedToggle({ includeArchived }: Props) {
  return (
    <div className="flex gap-1 rounded-lg bg-muted p-1 text-xs">
      <Link
        href="/promotions"
        className={cn(
          "rounded-md px-3 py-1 transition-colors",
          !includeArchived ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
        )}
      >
        Ativas
      </Link>
      <Link
        href="/promotions?archived=true"
        className={cn(
          "rounded-md px-3 py-1 transition-colors",
          includeArchived ? "bg-card text-foreground shadow-sm" : "text-muted-foreground",
        )}
      >
        Todas
      </Link>
    </div>
  );
}
