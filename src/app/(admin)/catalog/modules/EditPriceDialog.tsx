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
import { formatCurrencyCents } from "@/lib/formatters";

const schema = z.object({
  priceReais: z
    .number({ message: "Preço é obrigatório" })
    .min(0, "Preço deve ser maior ou igual a zero"),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  moduleId: string;
  displayName: string;
  currentPriceCents: number;
  open: boolean;
  onClose: () => void;
}

export default function EditPriceDialog({
  moduleId,
  displayName,
  currentPriceCents,
  open,
  onClose,
}: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { priceReais: currentPriceCents / 100, notes: "" },
  });

  const watchedPrice = watch("priceReais");
  const newPriceCents =
    typeof watchedPrice === "number" && !Number.isNaN(watchedPrice)
      ? Math.round(watchedPrice * 100)
      : null;

  function close() {
    reset({ priceReais: currentPriceCents / 100, notes: "" });
    onClose();
  }

  const onSubmit = handleSubmit(async (values) => {
    const priceCents = Math.round(values.priceReais * 100);
    if (priceCents === currentPriceCents) {
      toast.info("Preço inalterado");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(`/api/catalog/modules/${moduleId}/price`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceCents, notes: values.notes || null }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        toast.error(body.title ?? "Erro ao atualizar preço", { description: body.detail });
        return;
      }
      toast.success("Preço atualizado");
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
          <DialogTitle>Editar preço — {displayName}</DialogTitle>
          <DialogDescription>
            Cria nova versão. Afeta novos signups e clientes sem <code>price_locked</code>.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="rounded-lg bg-muted p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Preço atual:</span>
              <span className="font-medium">{formatCurrencyCents(currentPriceCents)}</span>
            </div>
            {newPriceCents !== null && newPriceCents !== currentPriceCents && (
              <div className="mt-1 flex items-center justify-between">
                <span className="text-muted-foreground">Novo preço:</span>
                <span className="font-medium text-brand-500">{formatCurrencyCents(newPriceCents)}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="priceReais">Novo preço (R$)</Label>
            <Input
              id="priceReais"
              type="number"
              step="0.01"
              min={0}
              {...register("priceReais", { valueAsNumber: true })}
            />
            {errors.priceReais && (
              <p className="text-sm text-destructive">{errors.priceReais.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Ex: Reajuste anual 2027"
              rows={3}
              {...register("notes")}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar nova versão"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
