"use client";

import { useState } from "react";
import { History, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditPriceDialog from "./EditPriceDialog";
import PriceHistoryDialog from "./PriceHistoryDialog";

interface Props {
  moduleId: string;
  displayName: string;
  currentPriceCents: number;
}

export default function ModuleRowActions({ moduleId, displayName, currentPriceCents }: Props) {
  const [open, setOpen] = useState<"edit" | "history" | null>(null);

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Editar preço"
          onClick={() => setOpen("edit")}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Ver histórico"
          onClick={() => setOpen("history")}
        >
          <History className="h-4 w-4" />
        </Button>
      </div>
      <EditPriceDialog
        moduleId={moduleId}
        displayName={displayName}
        currentPriceCents={currentPriceCents}
        open={open === "edit"}
        onClose={() => setOpen(null)}
      />
      <PriceHistoryDialog
        moduleId={moduleId}
        displayName={displayName}
        open={open === "history"}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
