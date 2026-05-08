import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { RecentSignupResponse } from "@/lib/api/dashboard";
import type { SubscriptionStatus } from "@/lib/api/tenants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/formatters";

interface RecentSignupsListProps {
  rows: RecentSignupResponse[];
}

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

export default function RecentSignupsList({ rows }: RecentSignupsListProps) {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Últimos cadastros
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Nenhum tenant cadastrado.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <li key={row.tenantId} className="flex items-center justify-between gap-3 py-2.5">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-foreground">{row.tenantName}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{row.vertical}</span>
                    <span>·</span>
                    <span>{formatDateTime(row.createdAt)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {row.subscriptionStatus ? (
                    <Badge className={cn("rounded-md font-medium", STATUS_CLASSES[row.subscriptionStatus])}>
                      {STATUS_LABEL[row.subscriptionStatus]}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">sem plano</span>
                  )}
                  <Link
                    href={`/tenants/${row.tenantId}`}
                    aria-label={`Abrir ${row.tenantName}`}
                    className={buttonVariants({ variant: "ghost", size: "icon" })}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
