"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewBundleDialog from "./NewBundleDialog";

export default function NewBundleButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-1 h-4 w-4" />
        Novo bundle
      </Button>
      <NewBundleDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
