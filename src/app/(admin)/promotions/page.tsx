import {
  listPromotions,
  type AdminPromotion,
  type DiscountType,
  type PromotionType,
} from "@/lib/api/promotions";
import { formatCurrencyCents, formatDate } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import PromotionRowActions from "./PromotionRowActions";
import NewPromotionButton from "./NewPromotionButton";
import ArchivedToggle from "./ArchivedToggle";
import Pagination from "./Pagination";

const TYPE_LABEL: Record<PromotionType, string> = {
  COUPON: "Cupom",
  BUNDLE: "Bundle",
  GRANT: "Cortesia",
  REFERRAL: "Indicação",
  LOYALTY: "Fidelidade",
  WINBACK: "Reativação",
  CAMPAIGN: "Campanha",
  PARTNER: "Parceiro",
  TRIAL_EXTENSION: "Trial estendido",
  VOLUME_DISCOUNT: "Volume",
  CROSS_SELL: "Cross-sell",
  ANNIVERSARY: "Aniversário",
};

interface PageProps {
  searchParams: Promise<{ archived?: string; page?: string }>;
}

export default async function PromotionsPage({ searchParams }: PageProps) {
  const { archived, page: pageParam } = await searchParams;
  const includeArchived = archived === "true";
  const page = pageParam ? Math.max(0, Number(pageParam)) : 0;

  const result = await listPromotions({ includeArchived, page, size: 20 });

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Promoções</h1>
        <div className="flex items-center gap-3">
          <ArchivedToggle includeArchived={includeArchived} />
          <NewPromotionButton />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Desconto</TableHead>
              <TableHead className="text-right">Uso</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[120px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.content.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  Nenhuma promoção cadastrada.
                </TableCell>
              </TableRow>
            )}
            {result.content.map((p) => (
              <TableRow key={p.id} className={cn(p.archivedAt && "opacity-60")}>
                <TableCell>
                  {p.code ? (
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{p.code}</code>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                <TableCell>
                  <Badge className="rounded-md bg-muted text-xs text-muted-foreground">
                    {TYPE_LABEL[p.type]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-sm">{formatDiscount(p.discountType, p.discountValue)}</TableCell>
                <TableCell className="text-right text-sm">
                  {p.currentRedemptions} / {p.maxRedemptions ?? "∞"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(p.validFrom)} → {formatDate(p.validUntil)}
                </TableCell>
                <TableCell>
                  {p.archivedAt ? (
                    <Badge className="rounded-md bg-muted text-muted-foreground text-xs">Arquivada</Badge>
                  ) : (
                    <Badge className="rounded-md bg-success/15 text-success text-xs">Ativa</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <PromotionRowActions promotion={p} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        totalElements={result.totalElements}
        includeArchived={includeArchived}
      />
    </main>
  );
}

function formatDiscount(type: DiscountType, value: number): string {
  switch (type) {
    case "PERCENTAGE":
      return `${value}%`;
    case "FIXED_AMOUNT":
      return formatCurrencyCents(value);
    case "FREE_MONTHS":
      return `${value} ${value === 1 ? "mês" : "meses"} grátis`;
    case "TRIAL_EXTENSION_DAYS":
      return `+${value} dias trial`;
  }
}

export type { AdminPromotion };
