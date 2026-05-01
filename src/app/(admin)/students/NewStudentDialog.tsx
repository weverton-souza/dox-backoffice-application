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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const schema = z.object({
  tenantId: z.string().regex(UUID_REGEX, "UUID inválido"),
  userId: z.string().regex(UUID_REGEX, "UUID inválido"),
  documentUrl: z.string().url("URL inválida"),
  institution: z.string().max(200).optional(),
  course: z.string().max(200).optional(),
  expectedGraduation: z.string().optional(),
  notes: z.string().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function NewStudentDialog({ open, onClose }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      tenantId: "",
      userId: "",
      documentUrl: "",
      institution: "",
      course: "",
      expectedGraduation: "",
      notes: "",
    },
  });

  function close() {
    reset();
    onClose();
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const response = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenantId: values.tenantId,
          userId: values.userId,
          documentUrl: values.documentUrl,
          institution: values.institution || null,
          course: values.course || null,
          expectedGraduation: values.expectedGraduation || null,
          notes: values.notes || null,
        }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as { title?: string; detail?: string };
        toast.error(body.title ?? "Erro ao cadastrar", { description: body.detail });
        return;
      }
      toast.success("Verificação cadastrada");
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
          <DialogTitle>Cadastrar verificação manualmente</DialogTitle>
          <DialogDescription>
            Use quando o profissional enviar a carteirinha por email enquanto upload via app não existe.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="tenantId">Tenant ID</Label>
            <Input id="tenantId" placeholder="UUID" className="font-mono text-xs" {...register("tenantId")} />
            {errors.tenantId && <p className="text-xs text-destructive">{errors.tenantId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input id="userId" placeholder="UUID" className="font-mono text-xs" {...register("userId")} />
            {errors.userId && <p className="text-xs text-destructive">{errors.userId.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="documentUrl">URL do documento</Label>
            <Input
              id="documentUrl"
              type="url"
              placeholder="https://drive.google.com/file/..."
              {...register("documentUrl")}
            />
            {errors.documentUrl && <p className="text-xs text-destructive">{errors.documentUrl.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="institution">Instituição</Label>
              <Input id="institution" placeholder="USP" {...register("institution")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Curso</Label>
              <Input id="course" placeholder="Psicologia" {...register("course")} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expectedGraduation">Conclusão prevista</Label>
            <Input id="expectedGraduation" type="date" {...register("expectedGraduation")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea id="notes" rows={2} {...register("notes")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
