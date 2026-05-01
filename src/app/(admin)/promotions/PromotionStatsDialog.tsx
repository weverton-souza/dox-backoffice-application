"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminPromotionStats } from "@/lib/api/promotions";

interface Props {
  promotionId: string;
  promotionName: string;
  open: boolean;
  onClose: () => void;
}

export default function PromotionStatsDialog({ promotionId, promotionName, open, onClose }: Props) {
  const [stats, setStats] = useState<AdminPromotionStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch(`/api/promotions/${promotionId}/stats`)
      .then(async (response) => {
        if (cancelled) return;
        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { title?: string };
          setError(body.title ?? "Erro ao carregar stats");
          return;
        }
        const data = (await response.json()) as AdminPromotionStats;
        setStats(data);
      })
      .catch(() => {
        if (!cancelled) setError("Erro de rede");
      });
    return () => {
      cancelled = true;
    };
  }, [open, promotionId]);

  function handleClose() {
    setStats(null);
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Estatísticas — {promotionName}</DialogTitle>
          <DialogDescription>Uso atual da promoção.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {!error && stats === null && <Skeleton className="h-20 w-full" />}
          {stats && (
            <>
              <div className="rounded-lg bg-muted p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Resgates:</span>
                  <span className="font-medium text-foreground">
                    {stats.currentRedemptions} / {stats.maxRedemptions ?? "∞"}
                  </span>
                </div>
              </div>
              {stats.activeTenantIds.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Tenants ativos:</p>
                  <div className="max-h-48 space-y-0.5 overflow-y-auto rounded-lg border border-border bg-background p-2">
                    {stats.activeTenantIds.map((id) => (
                      <code key={id} className="block text-xs text-muted-foreground">{id}</code>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Lista de tenants ativos não disponível ainda.
                </p>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
