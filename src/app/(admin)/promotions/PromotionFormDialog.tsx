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
import { MODULES } from "@/lib/modules";
import type {
  AdminPromotion,
  AppliesTo,
  CreatePromotionRequest,
  DiscountType,
  DurationType,
  PromotionType,
  UpdatePromotionRequest,
} from "@/lib/api/promotions";

const PROMOTION_TYPES: PromotionType[] = [
  "COUPON",
  "BUNDLE",
  "GRANT",
  "REFERRAL",
  "LOYALTY",
  "WINBACK",
  "CAMPAIGN",
  "PARTNER",
  "TRIAL_EXTENSION",
  "VOLUME_DISCOUNT",
  "CROSS_SELL",
  "ANNIVERSARY",
];

const DISCOUNT_TYPES: DiscountType[] = [
  "PERCENTAGE",
  "FIXED_AMOUNT",
  "FREE_MONTHS",
  "TRIAL_EXTENSION_DAYS",
];

const DURATION_TYPES: DurationType[] = ["ONCE", "FOREVER", "FIXED_MONTHS"];
const APPLIES_TO: AppliesTo[] = ["ALL_MODULES", "SPECIFIC_MODULES", "MIN_BUNDLE", "FIRST_PAYMENT_ONLY"];

const schema = z.object({
  code: z.string().max(60).optional(),
  name: z.string().min(1, "Nome é obrigatório").max(150),
  type: z.string().min(1),
  discountType: z.string().min(1),
  discountValue: z.number({ message: "Valor é obrigatório" }).min(0),
  durationType: z.string().min(1),
  durationMonths: z.number().min(1).optional(),
  maxRedemptions: z.number().min(1).optional(),
  validFrom: z.string().optional(),
  validUntil: z.string().optional(),
  appliesTo: z.string().min(1),
  appliesToModules: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  promotion?: AdminPromotion;
  open: boolean;
  onClose: () => void;
}

export default function PromotionFormDialog({ promotion, open, onClose }: Props) {
  const router = useRouter();
  const isEdit = !!promotion;
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
      code: promotion?.code ?? "",
      name: promotion?.name ?? "",
      type: promotion?.type ?? "COUPON",
      discountType: promotion?.discountType ?? "PERCENTAGE",
      discountValue: promotion?.discountValue ?? 0,
      durationType: promotion?.durationType ?? "ONCE",
      durationMonths: promotion?.durationMonths ?? undefined,
      maxRedemptions: promotion?.maxRedemptions ?? undefined,
      validFrom: promotion?.validFrom ?? "",
      validUntil: promotion?.validUntil ?? "",
      appliesTo: promotion?.appliesTo ?? "ALL_MODULES",
      appliesToModules: promotion?.appliesToModules ?? [],
    },
  });

  const watchDurationType = watch("durationType");
  const watchAppliesTo = watch("appliesTo");
  const selectedModules = watch("appliesToModules") ?? [];

  function close() {
    reset();
    onClose();
  }

  function toggleModule(moduleId: string, checked: boolean) {
    const current = new Set(selectedModules);
    if (checked) current.add(moduleId);
    else current.delete(moduleId);
    setValue("appliesToModules", Array.from(current), { shouldDirty: true });
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      let response: Response;
      if (isEdit && promotion) {
        const payload: UpdatePromotionRequest = {
          name: values.name !== promotion.name ? values.name : undefined,
          maxRedemptions:
            values.maxRedemptions !== undefined && values.maxRedemptions !== promotion.maxRedemptions
              ? values.maxRedemptions
              : undefined,
          validFrom:
            values.validFrom && values.validFrom !== promotion.validFrom ? values.validFrom : undefined,
          validUntil:
            values.validUntil && values.validUntil !== promotion.validUntil
              ? values.validUntil
              : undefined,
          appliesToModules: values.appliesToModules,
        };
        response = await fetch(`/api/promotions/${promotion.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        const payload: CreatePromotionRequest = {
          code: values.code?.trim() || null,
          name: values.name,
          type: values.type as PromotionType,
          discountType: values.discountType as DiscountType,
          discountValue: values.discountValue,
          durationType: values.durationType as DurationType,
          durationMonths:
            values.durationType === "FIXED_MONTHS" ? values.durationMonths ?? null : null,
          maxRedemptions: values.maxRedemptions ?? null,
          validFrom: values.validFrom || null,
          validUntil: values.validUntil || null,
          appliesTo: values.appliesTo as AppliesTo,
          appliesToModules:
            values.appliesTo === "SPECIFIC_MODULES" ? values.appliesToModules ?? [] : [],
        };
        response = await fetch("/api/promotions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        toast.error(body.title ?? "Erro ao salvar", { description: body.detail });
        return;
      }
      toast.success(isEdit ? "Promoção atualizada" : "Promoção criada");
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
          <DialogTitle>{isEdit ? "Editar promoção" : "Nova promoção"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Code, type e valor do desconto não podem ser alterados — crie uma nova promoção se precisar."
              : "Cadastre uma nova promoção no catálogo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                placeholder="BLACKFRIDAY26"
                disabled={isEdit}
                {...register("code")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select
                value={watch("type")}
                onValueChange={(v) => v && setValue("type", v, { shouldDirty: true })}
                disabled={isEdit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROMOTION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de desconto</Label>
              <Select
                value={watch("discountType")}
                onValueChange={(v) => v && setValue("discountType", v, { shouldDirty: true })}
                disabled={isEdit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DISCOUNT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="discountValue">Valor</Label>
              <Input
                id="discountValue"
                type="number"
                min={0}
                disabled={isEdit}
                {...register("discountValue", { valueAsNumber: true })}
              />
              {errors.discountValue && (
                <p className="text-xs text-destructive">{errors.discountValue.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Duração</Label>
              <Select
                value={watch("durationType")}
                onValueChange={(v) => v && setValue("durationType", v, { shouldDirty: true })}
                disabled={isEdit}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {watchDurationType === "FIXED_MONTHS" && (
              <div className="space-y-2">
                <Label htmlFor="durationMonths">Meses</Label>
                <Input
                  id="durationMonths"
                  type="number"
                  min={1}
                  disabled={isEdit}
                  {...register("durationMonths", { valueAsNumber: true })}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="maxRedemptions">Máx resgates</Label>
              <Input
                id="maxRedemptions"
                type="number"
                min={1}
                {...register("maxRedemptions", { valueAsNumber: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validFrom">Válida a partir de</Label>
              <Input id="validFrom" type="datetime-local" {...register("validFrom")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="validUntil">Válida até</Label>
              <Input id="validUntil" type="datetime-local" {...register("validUntil")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Aplica em</Label>
            <Select
              value={watch("appliesTo")}
              onValueChange={(v) => v && setValue("appliesTo", v, { shouldDirty: true })}
              disabled={isEdit}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {APPLIES_TO.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {watchAppliesTo === "SPECIFIC_MODULES" && (
            <div className="space-y-2">
              <Label>Módulos específicos</Label>
              <div className="grid grid-cols-2 gap-2">
                {MODULES.map((m) => (
                  <label key={m.id} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border"
                      checked={selectedModules.includes(m.id)}
                      onChange={(e) => toggleModule(m.id, e.target.checked)}
                    />
                    <span className="text-foreground">{m.displayName}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : isEdit ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
