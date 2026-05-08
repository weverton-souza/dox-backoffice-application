"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Database, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { BackfillSnapshotsResponse } from "@/lib/api/dashboard-types";

export default function BackfillButton() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleClick() {
    if (submitting || isPending) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/dashboard/snapshots/backfill?months=12", {
        method: "POST",
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        throw new Error(body.detail ?? body.title ?? "Erro inesperado");
      }
      const result = (await response.json()) as BackfillSnapshotsResponse;
      toast.success(`${result.captured.length} snapshots capturados`, {
        description: "Histórico mensal atualizado para os últimos 12 meses.",
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro inesperado";
      toast.error("Falha no backfill", { description: message });
    } finally {
      setSubmitting(false);
    }
  }

  const loading = submitting || isPending;

  return (
    <Button onClick={handleClick} disabled={loading} variant="outline" size="sm">
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
      {loading ? "Capturando…" : "Backfill 12m"}
    </Button>
  );
}
