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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const lockSchema = z.object({
  reason: z.string().min(1, "Motivo é obrigatório").max(500),
});
const unlockSchema = z.object({
  reason: z.string().max(500).optional(),
});

type LockValues = z.infer<typeof lockSchema>;
type UnlockValues = z.infer<typeof unlockSchema>;

interface Props {
  tenantId: string;
  unlockMode: boolean;
  open: boolean;
  onClose: () => void;
}

export default function PriceLockDialog({ tenantId, unlockMode, open, onClose }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LockValues | UnlockValues>({
    resolver: zodResolver(unlockMode ? unlockSchema : lockSchema),
    defaultValues: { reason: "" },
  });

  function close() {
    reset();
    onClose();
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const path = unlockMode ? "unlock-price" : "lock-price";
      const response = await fetch(`/api/tenants/${tenantId}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: values.reason || null }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        toast.error(body.title ?? "Erro", { description: body.detail });
        return;
      }
      toast.success(unlockMode ? "Preço desbloqueado" : "Tenant marcado como Founding Member");
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
          <DialogTitle>{unlockMode ? "Desbloquear preço" : "Marcar como Founding Member"}</DialogTitle>
          <DialogDescription>
            {unlockMode
              ? "Remove lock dos módulos ativos. Mudanças no catálogo voltarão a afetar este tenant."
              : "Bloqueia o preço atual de todos os módulos ativos. Reajustes no catálogo não afetarão este tenant."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo {unlockMode ? "(opcional)" : ""}</Label>
            <Textarea
              id="reason"
              placeholder={unlockMode ? "Ex: Encerramento do programa Founding" : "Ex: Founding member - primeiros 10 clientes"}
              rows={3}
              {...register("reason")}
            />
            {errors.reason && <p className="text-sm text-destructive">{errors.reason.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : unlockMode ? "Desbloquear" : "Bloquear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
