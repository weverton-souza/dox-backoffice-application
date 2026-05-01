"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminBundleListItem } from "@/lib/api/catalog";
import EditBundleDialog from "./EditBundleDialog";

interface Props {
  bundle: AdminBundleListItem;
}

export default function BundleRowActions({ bundle }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Editar ${bundle.name}`}
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <EditBundleDialog bundle={bundle} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
