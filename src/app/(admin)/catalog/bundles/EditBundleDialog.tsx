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
import { moduleDisplayName } from "@/lib/modules";
import type { AdminBundleListItem, UpdateBundleRequest } from "@/lib/api/catalog";

const schema = z.object({
  priceMonthlyReais: z.number().min(0).optional(),
  priceYearlyReais: z.number().min(0).optional(),
  description: z.string().max(500).optional(),
  clearDescription: z.boolean().optional(),
  seatsIncluded: z.number().int().min(1).optional(),
  trackingSlotsIncluded: z.number().int().min(0).optional(),
  highlighted: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  bundle: AdminBundleListItem;
  open: boolean;
  onClose: () => void;
}

export default function EditBundleDialog({ bundle, open, onClose }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      priceMonthlyReais: bundle.priceMonthlyCents / 100,
      priceYearlyReais: bundle.priceYearlyCents / 100,
      description: bundle.description ?? "",
      clearDescription: false,
      seatsIncluded: bundle.seatsIncluded,
      trackingSlotsIncluded: bundle.trackingSlotsIncluded,
      highlighted: bundle.highlighted,
      sortOrder: bundle.sortOrder,
      notes: "",
    },
  });

  const watchedMonthly = watch("priceMonthlyReais");
  const watchedYearly = watch("priceYearlyReais");
  const clearDesc = watch("clearDescription");

  function close() {
    reset();
    onClose();
  }

  function diff<T>(current: T, next: T | undefined): T | null {
    if (next === undefined) return null;
    return current === next ? null : next;
  }

  const onSubmit = handleSubmit(async (values) => {
    const payload: UpdateBundleRequest = {};

    const newMonthly =
      typeof values.priceMonthlyReais === "number" && !Number.isNaN(values.priceMonthlyReais)
        ? Math.round(values.priceMonthlyReais * 100)
        : undefined;
    if (newMonthly !== undefined && newMonthly !== bundle.priceMonthlyCents) {
      payload.priceMonthlyCents = newMonthly;
    }

    const newYearly =
      typeof values.priceYearlyReais === "number" && !Number.isNaN(values.priceYearlyReais)
        ? Math.round(values.priceYearlyReais * 100)
        : undefined;
    if (newYearly !== undefined && newYearly !== bundle.priceYearlyCents) {
      payload.priceYearlyCents = newYearly;
    }

    if (values.clearDescription) {
      payload.description = "";
    } else {
      const d = diff(bundle.description ?? "", values.description);
      if (d !== null) payload.description = d;
    }

    const seats = diff(bundle.seatsIncluded, values.seatsIncluded);
    if (seats !== null) payload.seatsIncluded = seats;

    const slots = diff(bundle.trackingSlotsIncluded, values.trackingSlotsIncluded);
    if (slots !== null) payload.trackingSlotsIncluded = slots;

    const hi = diff(bundle.highlighted, values.highlighted);
    if (hi !== null) payload.highlighted = hi;

    const sort = diff(bundle.sortOrder, values.sortOrder);
    if (sort !== null) payload.sortOrder = sort;

    if (values.notes) payload.notes = values.notes;

    if (Object.keys(payload).length === 0 || (Object.keys(payload).length === 1 && payload.notes)) {
      toast.info("Nada alterado");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/catalog/bundles/${bundle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        toast.error(body.title ?? "Erro ao salvar", { description: body.detail });
        return;
      }
      toast.success("Bundle atualizado");
      close();
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar bundle — {bundle.name}</DialogTitle>
          <DialogDescription>
            Apenas os campos alterados serão enviados. <code>name</code>, módulos e <code>active</code>{" "}
            via migration.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">ID:</span> <code>{bundle.id}</code>
          </div>
          <div className="mt-1">
            <span className="font-medium text-foreground">Módulos:</span>{" "}
            {bundle.modules.map((m) => moduleDisplayName(m)).join(", ")}
          </div>
          <div className="mt-1">
            <span className="font-medium text-foreground">Status:</span>{" "}
            {bundle.active ? "Ativo" : "Inativo"}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="priceMonthlyReais">Mensal (R$)</Label>
              <Input
                id="priceMonthlyReais"
                type="number"
                step="0.01"
                min={0}
                {...register("priceMonthlyReais", { valueAsNumber: true })}
              />
              {errors.priceMonthlyReais && (
                <p className="text-xs text-destructive">{errors.priceMonthlyReais.message}</p>
              )}
              {typeof watchedMonthly === "number" &&
                !Number.isNaN(watchedMonthly) &&
                Math.round(watchedMonthly * 100) !== bundle.priceMonthlyCents && (
                  <p className="text-xs text-muted-foreground">
                    Era {formatCurrencyCents(bundle.priceMonthlyCents)}
                  </p>
                )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceYearlyReais">Anual (R$)</Label>
              <Input
                id="priceYearlyReais"
                type="number"
                step="0.01"
                min={0}
                {...register("priceYearlyReais", { valueAsNumber: true })}
              />
              {typeof watchedYearly === "number" &&
                !Number.isNaN(watchedYearly) &&
                Math.round(watchedYearly * 100) !== bundle.priceYearlyCents && (
                  <p className="text-xs text-muted-foreground">
                    Era {formatCurrencyCents(bundle.priceYearlyCents)}
                  </p>
                )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="seatsIncluded">Seats</Label>
              <Input
                id="seatsIncluded"
                type="number"
                min={1}
                step={1}
                {...register("seatsIncluded", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trackingSlotsIncluded">Tracking</Label>
              <Input
                id="trackingSlotsIncluded"
                type="number"
                min={0}
                step={1}
                {...register("trackingSlotsIncluded", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sortOrder">Ordem</Label>
              <Input
                id="sortOrder"
                type="number"
                min={0}
                step={1}
                {...register("sortOrder", { valueAsNumber: true })}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-border"
              {...register("highlighted")}
            />
            <span className="text-foreground">Destacar como recomendado</span>
          </label>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">Descrição</Label>
              {bundle.description && (
                <button
                  type="button"
                  onClick={() => {
                    setValue("description", "");
                    setValue("clearDescription", true);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Limpar
                </button>
              )}
            </div>
            <Textarea
              id="description"
              rows={2}
              placeholder="Descrição comercial do plano"
              disabled={clearDesc}
              {...register("description")}
            />
            {clearDesc && (
              <p className="text-xs text-warning">Descrição será apagada ao salvar.</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (audit, opcional)</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Ex: Reajuste maio/2026"
              {...register("notes")}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
