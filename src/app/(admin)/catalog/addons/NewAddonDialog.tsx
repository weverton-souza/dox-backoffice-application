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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MODULES } from "@/lib/modules";
import type { AddonType, CreateAddonRequest } from "@/lib/api/catalog";

const ADDON_TYPES: { value: AddonType; label: string }[] = [
  { value: "MODULE", label: "Módulo extra" },
  { value: "SLOT_QUOTA", label: "Slot adicional" },
  { value: "SEAT_QUOTA", label: "Seat adicional" },
  { value: "PERCENTAGE_FEE", label: "Taxa percentual" },
];

const BUNDLE_OPTIONS = ["essencial", "plus", "pro", "clinica"];

const schema = z.object({
  id: z
    .string()
    .min(1, "Obrigatório")
    .max(50)
    .regex(/^[a-z0-9_-]+$/, "Apenas letras minúsculas, números, hífen e underscore"),
  name: z.string().min(1, "Obrigatório").max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["MODULE", "SLOT_QUOTA", "SEAT_QUOTA", "PERCENTAGE_FEE"]),
  targetModuleId: z.string().optional(),
  priceMonthlyReais: z.number().min(0),
  priceUnitReais: z.number().min(0).optional(),
  feePercentage: z.number().min(0).optional(),
  sortOrder: z.number().int().min(0),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewAddonDialog({ open, onClose }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [type, setType] = useState<AddonType>("MODULE");
  const [targetModuleId, setTargetModuleId] = useState<string>("");
  const [availableForBundles, setAvailableForBundles] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: "",
      name: "",
      description: "",
      type: "MODULE",
      targetModuleId: "",
      priceMonthlyReais: 0,
      priceUnitReais: 0,
      feePercentage: 0,
      sortOrder: 0,
      notes: "",
    },
  });

  function close() {
    reset();
    setType("MODULE");
    setTargetModuleId("");
    setAvailableForBundles([]);
    onClose();
  }

  function toggleBundle(id: string) {
    setAvailableForBundles((prev) =>
      prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id],
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    if (availableForBundles.length === 0) {
      toast.error("Selecione pelo menos um bundle de disponibilidade");
      return;
    }
    const payload: CreateAddonRequest = {
      id: values.id.trim(),
      name: values.name.trim(),
      description: values.description?.trim() || null,
      type,
      targetModuleId: targetModuleId || null,
      priceMonthlyCents: Math.round(values.priceMonthlyReais * 100),
      priceUnitCents:
        type === "SLOT_QUOTA" || type === "SEAT_QUOTA"
          ? Math.round((values.priceUnitReais ?? 0) * 100)
          : null,
      feePercentage: type === "PERCENTAGE_FEE" ? (values.feePercentage ?? 0).toFixed(2) : null,
      availableForBundles,
      sortOrder: values.sortOrder,
      notes: values.notes?.trim() || null,
    };

    setSubmitting(true);
    try {
      const response = await fetch("/api/catalog/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        toast.error(body.title ?? "Erro ao criar add-on", { description: body.detail });
        return;
      }
      toast.success("Add-on criado");
      close();
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  });

  const showUnit = type === "SLOT_QUOTA" || type === "SEAT_QUOTA";
  const showFee = type === "PERCENTAGE_FEE";
  const showTarget = type === "MODULE" || type === "SLOT_QUOTA";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo add-on</DialogTitle>
          <DialogDescription>
            ID, tipo e módulo alvo não podem ser alterados depois de criado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-[180px_1fr] gap-3">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" placeholder="payments_addon" {...register("id")} />
              {errors.id && <p className="text-xs text-destructive">{errors.id.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="DOX Pagamentos" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" rows={2} {...register("description")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(v) => setType((v as AddonType) ?? "MODULE")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADDON_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {showTarget && (
              <div className="space-y-2">
                <Label htmlFor="targetModuleId">Módulo alvo</Label>
                <Select value={targetModuleId} onValueChange={(v) => setTargetModuleId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    {MODULES.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="priceMonthlyReais">Mensal (R$)</Label>
              <Input
                id="priceMonthlyReais"
                type="number"
                step="0.01"
                min={0}
                {...register("priceMonthlyReais", { valueAsNumber: true })}
              />
            </div>
            {showUnit && (
              <div className="space-y-2">
                <Label htmlFor="priceUnitReais">Unitário (R$)</Label>
                <Input
                  id="priceUnitReais"
                  type="number"
                  step="0.01"
                  min={0}
                  {...register("priceUnitReais", { valueAsNumber: true })}
                />
              </div>
            )}
            {showFee && (
              <div className="space-y-2">
                <Label htmlFor="feePercentage">Taxa (%)</Label>
                <Input
                  id="feePercentage"
                  type="number"
                  step="0.01"
                  min={0}
                  {...register("feePercentage", { valueAsNumber: true })}
                />
              </div>
            )}
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

          <div className="space-y-2">
            <Label>Disponível em (bundles)</Label>
            <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-muted/40 p-3">
              {BUNDLE_OPTIONS.map((b) => (
                <label key={b} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={availableForBundles.includes(b)}
                    onChange={() => toggleBundle(b)}
                  />
                  <span className="capitalize">{b}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas (audit, opcional)</Label>
            <Textarea id="notes" rows={2} {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Criando..." : "Criar add-on"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
