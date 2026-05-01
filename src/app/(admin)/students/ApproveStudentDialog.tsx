"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  verificationId: string;
  open: boolean;
  onClose: () => void;
}

export default function ApproveStudentDialog({ verificationId, open, onClose }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState("");

  function close() {
    setNotes("");
    onClose();
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/students/${verificationId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notes.trim() || null }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        toast.error(body.title ?? "Erro ao aprovar", { description: body.detail });
        return;
      }
      toast.success("Aprovado · promoção STUDENT aplicada");
      close();
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aprovar verificação</DialogTitle>
          <DialogDescription>
            Vai aplicar a promoção <code>STUDENT</code> no tenant. Crie a promoção em{" "}
            <code>/promotions</code> antes se ainda não existe.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="notes">Notas (opcional)</Label>
          <Textarea
            id="notes"
            rows={3}
            placeholder="Ex: Carteirinha válida até 12/2028"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={close} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Aprovando..." : "Aprovar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
