"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  days: z.number({ message: "Dias é obrigatório" }).int().min(1, "Dias deve ser positivo"),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  tenantId: string;
  open: boolean;
  onClose: () => void;
}

export default function ExtendTrialDialog({ tenantId, open, onClose }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { days: 7, notes: "" },
  });

  function close() {
    reset();
    onClose();
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/tenants/${tenantId}/extend-trial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: values.days, notes: values.notes || null }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        toast.error(body.title ?? "Erro ao estender trial", { description: body.detail });
        return;
      }
      toast.success(`Trial estendido em ${values.days} dia(s)`);
      close();
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Estender trial</DialogTitle>
          <DialogDescription>
            Soma N dias em <code>subscription.trial_end</code>. Exige status TRIAL ou TRIAL_GRACE.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="days">Dias adicionais</Label>
            <Input
              id="days"
              type="number"
              min={1}
              step={1}
              {...register("days", { valueAsNumber: true })}
            />
            {errors.days && <p className="text-sm text-destructive">{errors.days.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Ex: Cliente solicitou mais tempo"
              rows={3}
              {...register("notes")}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Estendendo..." : "Estender"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
