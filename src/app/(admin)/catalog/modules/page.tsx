import { listCatalogModules } from "@/lib/api/catalog";
import { formatCurrencyCents, formatDateTime } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ModuleRowActions from "./ModuleRowActions";

export default async function CatalogModulesPage() {
  const modules = await listCatalogModules();

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Módulo</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Dependências</TableHead>
            <TableHead className="text-right">Preço atual</TableHead>
            <TableHead>Última atualização</TableHead>
            <TableHead className="w-[120px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {modules.map((m) => (
            <TableRow key={m.moduleId}>
              <TableCell className="font-medium text-foreground">{m.displayName}</TableCell>
              <TableCell>
                <code className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                  {m.moduleId}
                </code>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {m.dependencies.length === 0 ? (
                    <span className="text-sm text-muted-foreground">—</span>
                  ) : (
                    m.dependencies.map((dep) => (
                      <Badge key={dep} className="rounded-md bg-muted text-xs text-muted-foreground">
                        {dep}
                      </Badge>
                    ))
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-medium">
                    {formatCurrencyCents(m.currentPriceCents ?? m.basePriceCents)}
                  </span>
                  {m.hasFallback && (
                    <Badge className="rounded-md bg-warning/15 text-warning text-xs">Fallback</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDateTime(m.currentValidFrom)}
              </TableCell>
              <TableCell>
                <ModuleRowActions
                  moduleId={m.moduleId}
                  displayName={m.displayName}
                  currentPriceCents={m.currentPriceCents ?? m.basePriceCents}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
