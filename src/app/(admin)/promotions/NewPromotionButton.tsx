"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PromotionFormDialog from "./PromotionFormDialog";

export default function NewPromotionButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-1 h-4 w-4" />
        Nova promoção
      </Button>
      <PromotionFormDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
