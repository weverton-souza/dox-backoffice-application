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
import { MODULES } from "@/lib/modules";
import type { CreateBundleRequest } from "@/lib/api/catalog";

const schema = z.object({
  id: z
    .string()
    .min(1, "Obrigatório")
    .max(50)
    .regex(/^[a-z0-9_-]+$/, "Apenas letras minúsculas, números, hífen e underscore"),
  name: z.string().min(1, "Obrigatório").max(100),
  description: z.string().max(500).optional(),
  priceMonthlyReais: z.number().min(0),
  priceYearlyReais: z.number().min(0),
  seatsIncluded: z.number().int().min(1),
  trackingSlotsIncluded: z.number().int().min(0),
  highlighted: z.boolean(),
  sortOrder: z.number().int().min(0),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewBundleDialog({ open, onClose }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
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
      priceMonthlyReais: 0,
      priceYearlyReais: 0,
      seatsIncluded: 1,
      trackingSlotsIncluded: 0,
      highlighted: false,
      sortOrder: 0,
      notes: "",
    },
  });

  function close() {
    reset();
    setSelectedModules([]);
    onClose();
  }

  function toggleModule(id: string) {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  }

  const onSubmit = handleSubmit(async (values) => {
    if (selectedModules.length === 0) {
      toast.error("Selecione pelo menos um módulo");
      return;
    }
    const payload: CreateBundleRequest = {
      id: values.id.trim(),
      name: values.name.trim(),
      description: values.description?.trim() || null,
      modules: selectedModules,
      priceMonthlyCents: Math.round(values.priceMonthlyReais * 100),
      priceYearlyCents: Math.round(values.priceYearlyReais * 100),
      seatsIncluded: values.seatsIncluded,
      trackingSlotsIncluded: values.trackingSlotsIncluded,
      highlighted: values.highlighted,
      sortOrder: values.sortOrder,
      notes: values.notes?.trim() || null,
    };

    setSubmitting(true);
    try {
      const response = await fetch("/api/catalog/bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        toast.error(body.title ?? "Erro ao criar bundle", { description: body.detail });
        return;
      }
      toast.success("Bundle criado");
      close();
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && close()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo bundle</DialogTitle>
          <DialogDescription>
            ID e módulos não podem ser alterados depois de criado. Demais campos
            são editáveis via tela de edição.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-[180px_1fr] gap-3">
            <div className="space-y-2">
              <Label htmlFor="id">ID</Label>
              <Input id="id" placeholder="essencial-pro" {...register("id")} />
              {errors.id && <p className="text-xs text-destructive">{errors.id.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" placeholder="Essencial Pro" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              rows={2}
              placeholder="Descrição comercial do plano"
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label>Módulos inclusos</Label>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted/40 p-3">
              {MODULES.map((m) => (
                <label key={m.id} className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-border"
                    checked={selectedModules.includes(m.id)}
                    onChange={() => toggleModule(m.id)}
                  />
                  <span>{m.displayName}</span>
                  <code className="text-xs text-muted-foreground">{m.id}</code>
                </label>
              ))}
            </div>
            {selectedModules.length === 0 && (
              <p className="text-xs text-warning">Selecione pelo menos um módulo</p>
            )}
          </div>

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
            <Label htmlFor="notes">Notas (audit, opcional)</Label>
            <Textarea id="notes" rows={2} placeholder="Ex: Lançamento maio/2026" {...register("notes")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Criando..." : "Criar bundle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
