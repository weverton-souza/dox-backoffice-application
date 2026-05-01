import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  page: number;
  totalPages: number;
  totalElements: number;
  status: string;
}

export default function Pagination({ page, totalPages, totalElements, status }: Props) {
  if (totalElements === 0) return null;

  const buildHref = (target: number) => {
    const params = new URLSearchParams();
    if (status !== "PENDING") params.set("status", status);
    if (target > 0) params.set("page", String(target));
    const query = params.toString();
    return `/students${query ? `?${query}` : ""}`;
  };

  const prevDisabled = page === 0;
  const nextDisabled = page >= totalPages - 1;

  return (
    <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground">
      <span>
        {totalElements} {totalElements === 1 ? "verificação" : "verificações"} · Página {page + 1} de {totalPages || 1}
      </span>
      <div className="flex gap-2">
        <PageLink href={buildHref(page - 1)} disabled={prevDisabled}>
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </PageLink>
        <PageLink href={buildHref(page + 1)} disabled={nextDisabled}>
          Próxima
          <ChevronRight className="h-4 w-4" />
        </PageLink>
      </div>
    </div>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const className = buttonVariants({ variant: "outline", size: "sm" });
  if (disabled) {
    return <span className={cn(className, "pointer-events-none opacity-50")}>{children}</span>;
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
