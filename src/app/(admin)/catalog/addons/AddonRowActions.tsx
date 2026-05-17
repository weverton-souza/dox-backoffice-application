"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { AdminAddonListItem } from "@/lib/api/catalog";
import EditAddonDialog from "./EditAddonDialog";

interface Props {
  addon: AdminAddonListItem;
}

export default function AddonRowActions({ addon }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);

  async function handleArchive() {
    if (!window.confirm(`Arquivar add-on "${addon.name}"? Novas assinaturas ficarão indisponíveis.`)) return;
    setArchiving(true);
    try {
      const response = await fetch(`/api/catalog/addons/${addon.id}/archive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        toast.error(body.title ?? "Erro ao arquivar", { description: body.detail });
        return;
      }
      toast.success("Add-on arquivado");
      router.refresh();
    } finally {
      setArchiving(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Editar ${addon.name}`}
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      {addon.active && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Arquivar ${addon.name}`}
          disabled={archiving}
          onClick={handleArchive}
        >
          <Archive className="h-4 w-4" />
        </Button>
      )}
      <EditAddonDialog addon={addon} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
