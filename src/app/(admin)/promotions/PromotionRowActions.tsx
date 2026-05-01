"use client";

import { useState } from "react";
import { Archive, BarChart3, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { AdminPromotion } from "@/lib/api/promotions";
import PromotionFormDialog from "./PromotionFormDialog";
import PromotionStatsDialog from "./PromotionStatsDialog";

interface Props {
  promotion: AdminPromotion;
}

export default function PromotionRowActions({ promotion }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<"edit" | "stats" | null>(null);
  const [archiving, setArchiving] = useState(false);

  async function handleArchive() {
    if (!confirm(`Arquivar promoção "${promotion.name}"?`)) return;
    setArchiving(true);
    try {
      const response = await fetch(`/api/promotions/${promotion.id}/archive`, {
        method: "POST",
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string };
        toast.error(body.title ?? "Erro ao arquivar");
        return;
      }
      toast.success("Promoção arquivada");
      router.refresh();
    } finally {
      setArchiving(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Stats"
          onClick={() => setOpen("stats")}
        >
          <BarChart3 className="h-4 w-4" />
        </Button>
        {!promotion.archivedAt && (
          <>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Editar"
              onClick={() => setOpen("edit")}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Arquivar"
              onClick={handleArchive}
              disabled={archiving}
            >
              <Archive className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <PromotionFormDialog
        promotion={promotion}
        open={open === "edit"}
        onClose={() => setOpen(null)}
      />
      <PromotionStatsDialog
        promotionId={promotion.id}
        promotionName={promotion.name}
        open={open === "stats"}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
