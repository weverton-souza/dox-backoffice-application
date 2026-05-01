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
import type { AdminAddonListItem, UpdateAddonRequest } from "@/lib/api/catalog";

const ALL_BUNDLES = [
  { id: "essencial", label: "Essencial" },
  { id: "plus", label: "Plus" },
  { id: "pro", label: "Pro" },
  { id: "clinica", label: "Clínica" },
] as const;

const schema = z.object({
  priceMonthlyReais: z.number().min(0).optional(),
  priceUnitReais: z.number().min(0).optional(),
  feePercentage: z.number().min(0).optional(),
  active: z.boolean().optional(),
  availableForBundles: z.array(z.string()).optional(),
  sortOrder: z.number().int().min(0).optional(),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  addon: AdminAddonListItem;
  open: boolean;
  onClose: () => void;
}

export default function EditAddonDialog({ addon, open, onClose }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const initialFee = addon.feePercentage ? Number(addon.feePercentage) : undefined;
  const initialBundles = addon.availableForBundles;

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
      priceMonthlyReais: addon.priceMonthlyCents / 100,
      priceUnitReais: addon.priceUnitCents !== null ? addon.priceUnitCents / 100 : undefined,
      feePercentage: initialFee,
      active: addon.active,
      availableForBundles: initialBundles,
      sortOrder: addon.sortOrder,
      notes: "",
    },
  });

  const selectedBundles = watch("availableForBundles") ?? [];
  const watchedMonthly = watch("priceMonthlyReais");
  const watchedUnit = watch("priceUnitReais");
  const watchedFee = watch("feePercentage");

  function close() {
    reset();
    onClose();
  }

  function toggleBundle(bundleId: string, checked: boolean) {
    const current = new Set(selectedBundles);
    if (checked) current.add(bundleId);
    else current.delete(bundleId);
    setValue("availableForBundles", Array.from(current), { shouldDirty: true });
  }

  function arraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;
    const setA = new Set(a);
    return b.every((x) => setA.has(x));
  }

  const onSubmit = handleSubmit(async (values) => {
    const payload: UpdateAddonRequest = {};

    const newMonthly =
      typeof values.priceMonthlyReais === "number" && !Number.isNaN(values.priceMonthlyReais)
        ? Math.round(values.priceMonthlyReais * 100)
        : undefined;
    if (newMonthly !== undefined && newMonthly !== addon.priceMonthlyCents) {
      payload.priceMonthlyCents = newMonthly;
    }

    const newUnit =
      typeof values.priceUnitReais === "number" && !Number.isNaN(values.priceUnitReais)
        ? Math.round(values.priceUnitReais * 100)
        : undefined;
    if (newUnit !== undefined && newUnit !== addon.priceUnitCents) {
      payload.priceUnitCents = newUnit;
    }

    if (typeof values.feePercentage === "number" && !Number.isNaN(values.feePercentage)) {
      const newFee = values.feePercentage.toFixed(2);
      if (newFee !== addon.feePercentage) payload.feePercentage = newFee;
    }

    if (values.active !== undefined && values.active !== addon.active) {
      payload.active = values.active;
    }

    const newBundles = values.availableForBundles ?? [];
    if (!arraysEqual(newBundles, addon.availableForBundles)) {
      payload.availableForBundles = newBundles;
    }

    if (values.sortOrder !== undefined && values.sortOrder !== addon.sortOrder) {
      payload.sortOrder = values.sortOrder;
    }

    if (values.notes) payload.notes = values.notes;

    if (Object.keys(payload).length === 0 || (Object.keys(payload).length === 1 && payload.notes)) {
      toast.info("Nada alterado");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`/api/catalog/addons/${addon.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        toast.error(body.title ?? "Erro ao salvar", { description: body.detail });
        return;
      }
      toast.success("Add-on atualizado");
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
          <DialogTitle>Editar add-on — {addon.name}</DialogTitle>
          <DialogDescription>
            Apenas campos alterados são enviados. <code>name</code>, <code>type</code> e target via
            migration.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">ID:</span> <code>{addon.id}</code>
          </div>
          <div className="mt-1">
            <span className="font-medium text-foreground">Tipo:</span> {addon.type}
          </div>
          {addon.targetModuleId && (
            <div className="mt-1">
              <span className="font-medium text-foreground">Target:</span>{" "}
              {moduleDisplayName(addon.targetModuleId)}
            </div>
          )}
          {addon.description && (
            <div className="mt-1">
              <span className="font-medium text-foreground">Descrição:</span> {addon.description}
            </div>
          )}
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
              {typeof watchedMonthly === "number" &&
                !Number.isNaN(watchedMonthly) &&
                Math.round(watchedMonthly * 100) !== addon.priceMonthlyCents && (
                  <p className="text-xs text-muted-foreground">
                    Era {formatCurrencyCents(addon.priceMonthlyCents)}
                  </p>
                )}
              {errors.priceMonthlyReais && (
                <p className="text-xs text-destructive">{errors.priceMonthlyReais.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="priceUnitReais">Unitário (R$)</Label>
              <Input
                id="priceUnitReais"
                type="number"
                step="0.01"
                min={0}
                {...register("priceUnitReais", { valueAsNumber: true })}
              />
              {typeof watchedUnit === "number" &&
                !Number.isNaN(watchedUnit) &&
                addon.priceUnitCents !== null &&
                Math.round(watchedUnit * 100) !== addon.priceUnitCents && (
                  <p className="text-xs text-muted-foreground">
                    Era {formatCurrencyCents(addon.priceUnitCents)}
                  </p>
                )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="feePercentage">Taxa (%)</Label>
              <Input
                id="feePercentage"
                type="number"
                step="0.01"
                min={0}
                {...register("feePercentage", { valueAsNumber: true })}
              />
              {typeof watchedFee === "number" &&
                !Number.isNaN(watchedFee) &&
                addon.feePercentage !== null &&
                watchedFee.toFixed(2) !== addon.feePercentage && (
                  <p className="text-xs text-muted-foreground">Era {addon.feePercentage}%</p>
                )}
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
              {...register("active")}
            />
            <span className="text-foreground">Ativo (permite novas compras)</span>
          </label>

          <div className="space-y-2">
            <Label>Disponível para bundles</Label>
            <div className="grid grid-cols-2 gap-2">
              {ALL_BUNDLES.map((b) => (
                <label key={b.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={selectedBundles.includes(b.id)}
                    onChange={(e) => toggleBundle(b.id, e.target.checked)}
                  />
                  <span className="text-foreground">{b.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (audit, opcional)</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Ex: Reajuste taxa Asaas"
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
