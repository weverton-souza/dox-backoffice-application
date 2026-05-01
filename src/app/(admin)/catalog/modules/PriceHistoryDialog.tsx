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
import { formatCurrencyCents, formatDateTime } from "@/lib/formatters";
import type { AdminModulePriceResponse } from "@/lib/api/catalog";

interface Props {
  moduleId: string;
  displayName: string;
  open: boolean;
  onClose: () => void;
}

export default function PriceHistoryDialog({ moduleId, displayName, open, onClose }: Props) {
  const [history, setHistory] = useState<AdminModulePriceResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch(`/api/catalog/modules/${moduleId}/history?limit=50`)
      .then(async (response) => {
        if (cancelled) return;
        if (!response.ok) {
          const body = (await response.json().catch(() => ({}))) as { title?: string };
          setError(body.title ?? "Erro ao carregar histórico");
          return;
        }
        const data = (await response.json()) as AdminModulePriceResponse[];
        setHistory(data);
      })
      .catch(() => {
        if (!cancelled) setError("Erro de rede");
      });
    return () => {
      cancelled = true;
    };
  }, [open, moduleId]);

  function handleClose() {
    setHistory(null);
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Histórico de preços — {displayName}</DialogTitle>
          <DialogDescription>Últimas 50 versões, mais recentes primeiro.</DialogDescription>
        </DialogHeader>
        <div className="max-h-96 space-y-2 overflow-y-auto pr-1">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {!error && history === null && (
            <>
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </>
          )}
          {history && history.length === 0 && (
            <p className="text-sm text-muted-foreground">Sem versões registradas.</p>
          )}
          {history?.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border bg-background p-3"
            >
              <div className="space-y-0.5">
                <div className="text-sm font-medium text-foreground">
                  {formatCurrencyCents(item.priceCents)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatDateTime(item.validFrom)}
                  {item.validUntil && ` → ${formatDateTime(item.validUntil)}`}
                </div>
                {item.notes && (
                  <div className="text-xs text-muted-foreground">{item.notes}</div>
                )}
              </div>
              {item.validUntil === null && (
                <span className="rounded-md bg-success/15 px-2 py-0.5 text-xs font-medium text-success">
                  Atual
                </span>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
