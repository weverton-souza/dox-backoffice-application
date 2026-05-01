import { listCatalogAddons, type AddonType } from "@/lib/api/catalog";
import { formatCurrencyCents, formatDateTime } from "@/lib/formatters";
import { moduleDisplayName } from "@/lib/modules";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import AddonRowActions from "./AddonRowActions";

const TYPE_LABEL: Record<AddonType, string> = {
  MODULE: "Módulo",
  SLOT_QUOTA: "Slot",
  SEAT_QUOTA: "Seat",
  PERCENTAGE_FEE: "Taxa %",
};

const TYPE_CLASSES: Record<AddonType, string> = {
  MODULE: "bg-brand-100 text-brand-700",
  SLOT_QUOTA: "bg-success/15 text-success",
  SEAT_QUOTA: "bg-warning/15 text-warning",
  PERCENTAGE_FEE: "bg-muted text-muted-foreground",
};

const BUNDLE_LABEL: Record<string, string> = {
  essencial: "Essencial",
  plus: "Plus",
  pro: "Pro",
  clinica: "Clínica",
};

export default async function CatalogAddonsPage() {
  const addons = await listCatalogAddons();

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Target</TableHead>
            <TableHead className="text-right">Mensal</TableHead>
            <TableHead className="text-right">Unitário</TableHead>
            <TableHead className="text-right">Fee</TableHead>
            <TableHead>Disponível em</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Atualizado</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {addons.map((a) => (
            <TableRow key={a.id}>
              <TableCell>
                <div className="font-medium text-foreground">{a.name}</div>
                <code className="text-xs text-muted-foreground">{a.id}</code>
              </TableCell>
              <TableCell>
                <Badge className={`rounded-md text-xs ${TYPE_CLASSES[a.type]}`}>
                  {TYPE_LABEL[a.type]}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {a.targetModuleId ? moduleDisplayName(a.targetModuleId) : "—"}
              </TableCell>
              <TableCell className="text-right text-sm">
                {a.priceMonthlyCents > 0 ? formatCurrencyCents(a.priceMonthlyCents) : "—"}
              </TableCell>
              <TableCell className="text-right text-sm">
                {a.priceUnitCents !== null ? formatCurrencyCents(a.priceUnitCents) : "—"}
              </TableCell>
              <TableCell className="text-right text-sm">
                {a.feePercentage !== null ? `${a.feePercentage}%` : "—"}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {a.availableForBundles.length === 0 ? (
                    <span className="text-sm text-muted-foreground">—</span>
                  ) : (
                    a.availableForBundles.map((b) => (
                      <Badge key={b} className="rounded-md bg-muted text-xs text-muted-foreground">
                        {BUNDLE_LABEL[b] ?? b}
                      </Badge>
                    ))
                  )}
                </div>
              </TableCell>
              <TableCell>
                {a.active ? (
                  <Badge className="rounded-md bg-success/15 text-success text-xs">Ativo</Badge>
                ) : (
                  <Badge className="rounded-md bg-muted text-muted-foreground text-xs">Inativo</Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(a.updatedAt)}
              </TableCell>
              <TableCell>
                <AddonRowActions addon={a} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
