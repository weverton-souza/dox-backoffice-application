"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/catalog/modules", label: "Módulos" },
  { href: "/catalog/bundles", label: "Bundles" },
  { href: "/catalog/addons", label: "Add-ons" },
];

export default function CatalogTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 rounded-lg bg-muted p-1">
      {TABS.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
