import Link from "next/link";
import { ChevronLeft, ChevronRight, ChevronRight as Arrow } from "lucide-react";
import { listTenants, type SubscriptionStatus } from "@/lib/api/tenants";
import { formatCurrencyCents, formatDate } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import TenantsSearch from "./TenantsSearch";

const STATUS_LABEL: Record<SubscriptionStatus, string> = {
  TRIAL: "Trial",
  TRIAL_GRACE: "Trial (graça)",
  ACTIVE: "Ativo",
  GRACE: "Graça",
  SUSPENDED: "Suspenso",
  CANCEL_PENDING: "Cancelando",
  CANCELED: "Cancelado",
};

const STATUS_CLASSES: Record<SubscriptionStatus, string> = {
  TRIAL: "bg-brand-100 text-brand-700",
  TRIAL_GRACE: "border border-warning text-warning bg-transparent",
  ACTIVE: "bg-success/15 text-success",
  GRACE: "border border-warning text-warning bg-transparent",
  SUSPENDED: "bg-danger/15 text-danger",
  CANCEL_PENDING: "bg-muted text-muted-foreground",
  CANCELED: "bg-muted text-muted-foreground",
};

interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

export default async function TenantsPage({ searchParams }: PageProps) {
  const { search, page: pageParam } = await searchParams;
  const page = pageParam ? Math.max(0, Number(pageParam)) : 0;

  const result = await listTenants({ search, page, size: 15 });

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Tenants</h1>
        <TenantsSearch initial={search ?? ""} />
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Vertical</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">MRR</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[60px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.content.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                  {search ? `Nenhum tenant encontrado para "${search}"` : "Nenhum tenant cadastrado."}
                </TableCell>
              </TableRow>
            )}
            {result.content.map((tenant) => (
              <TableRow key={tenant.id} className="hover:bg-accent/50">
                <TableCell className="font-medium text-foreground">{tenant.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{tenant.vertical}</TableCell>
                <TableCell>
                  {tenant.subscriptionStatus ? (
                    <Badge className={cn("rounded-md font-medium", STATUS_CLASSES[tenant.subscriptionStatus])}>
                      {STATUS_LABEL[tenant.subscriptionStatus]}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrencyCents(tenant.mrrCents)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(tenant.createdAt)}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/tenants/${tenant.id}`}
                    aria-label={`Abrir ${tenant.name}`}
                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                  >
                    <Arrow className="h-4 w-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        totalElements={result.totalElements}
        search={search}
      />
    </main>
  );
}

function Pagination({
  page,
  totalPages,
  totalElements,
  search,
}: {
  page: number;
  totalPages: number;
  totalElements: number;
  search?: string;
}) {
  if (totalElements === 0) return null;

  const buildHref = (target: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (target > 0) params.set("page", String(target));
    const query = params.toString();
    return `/tenants${query ? `?${query}` : ""}`;
  };

  const prevDisabled = page === 0;
  const nextDisabled = page >= totalPages - 1;

  return (
    <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
      <span>
        {totalElements} {totalElements === 1 ? "tenant" : "tenants"} · Página {page + 1} de{" "}
        {totalPages || 1}
      </span>
      <div className="flex gap-2">
        <PageLink href={buildHref(page - 1)} disabled={prevDisabled}>
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </PageLink>
        <PageLink href={buildHref(page + 1)} disabled={nextDisabled}>
          Próxima
          <ChevronRight className="h-4 w-4" />
        </PageLink>
      </div>
    </div>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const className = buttonVariants({ variant: "outline", size: "sm" });
  if (disabled) {
    return (
      <span className={cn(className, "pointer-events-none opacity-50")}>{children}</span>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
