import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  listStudentVerifications,
  type StudentVerificationStatus,
} from "@/lib/api/students";
import { formatDate, formatDateTime } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StatusFilter from "./StatusFilter";
import NewStudentButton from "./NewStudentButton";
import StudentRowActions from "./StudentRowActions";
import Pagination from "./Pagination";

const STATUS_LABEL: Record<StudentVerificationStatus, string> = {
  PENDING: "Pendente",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
};

const STATUS_CLASSES: Record<StudentVerificationStatus, string> = {
  PENDING: "bg-warning/15 text-warning",
  APPROVED: "bg-success/15 text-success",
  REJECTED: "bg-danger/15 text-danger",
};

interface PageProps {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function StudentsPage({ searchParams }: PageProps) {
  const { status: statusParam, page: pageParam } = await searchParams;
  const status: StudentVerificationStatus | "ALL" =
    (statusParam as StudentVerificationStatus | "ALL" | undefined) ?? "PENDING";
  const page = pageParam ? Math.max(0, Number(pageParam)) : 0;

  const result = await listStudentVerifications({
    status: status === "ALL" ? undefined : status,
    page,
    size: 20,
  });

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Verificações de estudante</h1>
        <div className="flex items-center gap-3">
          <StatusFilter current={status} />
          <NewStudentButton />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead>Instituição</TableHead>
              <TableHead>Curso</TableHead>
              <TableHead>Conclusão</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-[120px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {result.content.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                  Nenhuma verificação {status === "ALL" ? "" : STATUS_LABEL[status as StudentVerificationStatus].toLowerCase()}.
                </TableCell>
              </TableRow>
            )}
            {result.content.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <Link
                    href={`/tenants/${s.tenantId}`}
                    className="font-mono text-xs text-muted-foreground hover:text-foreground"
                  >
                    {s.tenantId.slice(0, 8)}…
                  </Link>
                </TableCell>
                <TableCell className="text-sm text-foreground">{s.institution ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.course ?? "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(s.expectedGraduation)}</TableCell>
                <TableCell>
                  <Link
                    href={s.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "ghost", size: "xs" }), "gap-1")}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Abrir
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge className={cn("rounded-md text-xs", STATUS_CLASSES[s.status])}>
                    {STATUS_LABEL[s.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDateTime(s.createdAt)}
                </TableCell>
                <TableCell>
                  <StudentRowActions verification={s} />
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
        status={status}
      />
    </main>
  );
}
