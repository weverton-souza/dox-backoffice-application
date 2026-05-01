import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { getTenantDetail, type ModuleSource, type ModuleStatus, type SubscriptionStatus } from "@/lib/api/tenants";
import { formatCurrencyCents, formatDate, formatDateTime } from "@/lib/formatters";
import { moduleDisplayName } from "@/lib/modules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import ActionsMenu from "./ActionsMenu";

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

const MODULE_STATUS_LABEL: Record<ModuleStatus, string> = {
  TRIAL: "Trial",
  ACTIVE: "Ativo",
  GRACE: "Graça",
  SUSPENDED: "Suspenso",
  CANCELED: "Cancelado",
  GRANTED: "Concedido",
};

const MODULE_STATUS_CLASSES: Record<ModuleStatus, string> = {
  TRIAL: "bg-brand-100 text-brand-700",
  ACTIVE: "bg-success/15 text-success",
  GRACE: "border border-warning text-warning bg-transparent",
  SUSPENDED: "bg-danger/15 text-danger",
  CANCELED: "bg-muted text-muted-foreground",
  GRANTED: "bg-brand-50 text-brand-700",
};

const SOURCE_LABEL: Record<ModuleSource, string> = {
  TRIAL: "Trial",
  BUNDLE: "Plano",
  INDIVIDUAL: "Avulso",
  GRANT: "Cortesia",
  PROMOTION: "Promoção",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TenantDetailPage({ params }: PageProps) {
  const { id } = await params;

  let detail;
  try {
    detail = await getTenantDetail(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const { tenant, owner, subscription, bundle, modules, recentPayments } = detail;
  const allLocked = modules.length > 0 && modules.every((m) => m.priceLocked);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <Link
            href="/tenants"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Tenants
          </Link>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{tenant.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{tenant.vertical}</span>
              <span>·</span>
              <span>{tenant.type === "PERSONAL" ? "Pessoal" : "Organização"}</span>
              <span>·</span>
              <span>Criado em {formatDate(tenant.createdAt)}</span>
            </div>
            {owner && (
              <div className="text-sm text-muted-foreground">
                Owner: <span className="text-foreground">{owner.name}</span> · {owner.email}
              </div>
            )}
          </div>
        </div>
        <ActionsMenu tenantId={tenant.id} allLocked={allLocked} hasModules={modules.length > 0} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subscription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {subscription ? (
              <>
                <Row label="Status">
                  <Badge className={cn("rounded-md font-medium", STATUS_CLASSES[subscription.status])}>
                    {STATUS_LABEL[subscription.status]}
                  </Badge>
                </Row>
                <Row label="Plano">{bundle?.name ?? "—"}</Row>
                <Row label="MRR">{formatCurrencyCents(subscription.valueCents)}</Row>
                <Row label="Ciclo">{subscription.billingCycle === "MONTHLY" ? "Mensal" : "Anual"}</Row>
                <Row label="Pagamento">{subscription.billingType}</Row>
                <Separator className="my-1" />
                <Row label="Trial até">{formatDateTime(subscription.trialEnd)}</Row>
                <Row label="Próximo vencimento">{formatDate(subscription.nextDueDate)}</Row>
                <Row label="Período atual">
                  {formatDate(subscription.currentPeriodStart)} → {formatDate(subscription.currentPeriodEnd)}
                </Row>
                {subscription.canceledAt && (
                  <Row label="Cancelado em">{formatDateTime(subscription.canceledAt)}</Row>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">Sem subscription ativa.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Módulos ({modules.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {modules.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhum módulo ativo.</p>
            )}
            {modules.map((m) => (
              <div
                key={m.moduleId}
                className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{moduleDisplayName(m.moduleId)}</span>
                    <Badge className={cn("rounded-md text-xs", MODULE_STATUS_CLASSES[m.status])}>
                      {MODULE_STATUS_LABEL[m.status]}
                    </Badge>
                    {m.priceLocked && (
                      <Badge className="rounded-md bg-brand-50 text-brand-700 text-xs">Lock</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {SOURCE_LABEL[m.source]}
                    {m.expiresAt && ` · expira ${formatDate(m.expiresAt)}`}
                  </div>
                </div>
                <span className="text-sm font-medium text-foreground">
                  {formatCurrencyCents(m.finalPriceCents)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pagamentos recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vencimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Pago em</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    Sem pagamentos registrados.
                  </TableCell>
                </TableRow>
              )}
              {recentPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{formatDate(p.dueDate)}</TableCell>
                  <TableCell className="text-sm">{p.status}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.billingType}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrencyCents(p.amountCents)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(p.paidAt)}</TableCell>
                  <TableCell>
                    {p.invoiceUrl && (
                      <Link
                        href={p.invoiceUrl}
                        target="_blank"
                        className={buttonVariants({ variant: "ghost", size: "icon" })}
                        aria-label="Abrir fatura"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground">{children}</span>
    </div>
  );
}
