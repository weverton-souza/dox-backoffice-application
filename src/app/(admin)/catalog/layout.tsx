import type { ReactNode } from "react";
import CatalogTabs from "./CatalogTabs";

export default function CatalogLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Catálogo</h1>
        <CatalogTabs />
      </div>
      {children}
    </main>
  );
}
