import Link from "next/link";
import { Package, Users } from "lucide-react";

const NAV_ITEMS = [
  { label: "Tenants", href: "/tenants", icon: Users },
  { label: "Catálogo", href: "/catalog", icon: Package },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card md:flex">
      <div className="flex h-14 items-center border-b border-border px-5">
        <span className="text-base font-semibold tracking-tight text-foreground">DOX Admin</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <item.icon className="h-4 w-4 text-muted-foreground" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
