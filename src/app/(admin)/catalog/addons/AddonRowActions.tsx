"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminAddonListItem } from "@/lib/api/catalog";
import EditAddonDialog from "./EditAddonDialog";

interface Props {
  addon: AdminAddonListItem;
}

export default function AddonRowActions({ addon }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Editar ${addon.name}`}
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <EditAddonDialog addon={addon} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
