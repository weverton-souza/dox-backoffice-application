"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Archive, Pencil } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { AdminBundleListItem } from "@/lib/api/catalog";
import EditBundleDialog from "./EditBundleDialog";

interface Props {
  bundle: AdminBundleListItem;
}

export default function BundleRowActions({ bundle }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [archiving, setArchiving] = useState(false);

  async function handleArchive() {
    if (!window.confirm(`Arquivar bundle "${bundle.name}"? Novas assinaturas ficarão indisponíveis.`)) return;
    setArchiving(true);
    try {
      const response = await fetch(`/api/catalog/bundles/${bundle.id}/archive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        toast.error(body.title ?? "Erro ao arquivar", { description: body.detail });
        return;
      }
      toast.success("Bundle arquivado");
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
        aria-label={`Editar ${bundle.name}`}
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      {bundle.active && (
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Arquivar ${bundle.name}`}
          disabled={archiving}
          onClick={handleArchive}
        >
          <Archive className="h-4 w-4" />
        </Button>
      )}
      <EditBundleDialog bundle={bundle} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
