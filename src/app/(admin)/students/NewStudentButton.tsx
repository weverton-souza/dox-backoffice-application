"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewStudentDialog from "./NewStudentDialog";

export default function NewStudentButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-1 h-4 w-4" />
        Cadastrar manual
      </Button>
      <NewStudentDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
