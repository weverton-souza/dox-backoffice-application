import { Star } from "lucide-react";
import { listCatalogBundles } from "@/lib/api/catalog";
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
import TermHint from "@/components/TermHint";
import BundleRowActions from "./BundleRowActions";
import NewBundleButton from "./NewBundleButton";

export default async function CatalogBundlesPage() {
  const bundles = await listCatalogBundles();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <NewBundleButton />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <span className="inline-flex items-center">Nome<TermHint termId="bundle" /></span>
            </TableHead>
            <TableHead>
              <span className="inline-flex items-center">Módulos<TermHint termId="module" /></span>
            </TableHead>
            <TableHead className="text-right">Mensal</TableHead>
            <TableHead className="text-right">Anual</TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center justify-end">Seats<TermHint termId="seats" /></span>
            </TableHead>
            <TableHead className="text-right">
              <span className="inline-flex items-center justify-end">Tracking<TermHint termId="tracking" /></span>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Atualizado</TableHead>
            <TableHead className="w-[60px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {bundles.map((b) => (
            <TableRow key={b.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{b.name}</span>
                  {b.highlighted && (
                    <Star className="h-3.5 w-3.5 fill-warning text-warning" aria-label="Destaque" />
                  )}
                </div>
                <code className="text-xs text-muted-foreground">{b.id}</code>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {b.modules.map((m) => (
                    <Badge key={m} className="rounded-md bg-muted text-xs text-muted-foreground">
                      {moduleDisplayName(m)}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrencyCents(b.priceMonthlyCents)}
              </TableCell>
              <TableCell className="text-right text-sm">
                {formatCurrencyCents(b.priceYearlyCents)}
              </TableCell>
              <TableCell className="text-right text-sm">{b.seatsIncluded}</TableCell>
              <TableCell className="text-right text-sm">{b.trackingSlotsIncluded}</TableCell>
              <TableCell>
                {b.active ? (
                  <Badge className="rounded-md bg-success/15 text-success text-xs">Ativo</Badge>
                ) : (
                  <Badge className="rounded-md bg-muted text-muted-foreground text-xs">Inativo</Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(b.updatedAt)}
              </TableCell>
              <TableCell>
                <BundleRowActions bundle={b} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
