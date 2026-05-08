import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-[180px]" />
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <KpiSkeleton key={i} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <ListSkeleton />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ListSkeleton />
        <ListSkeleton />
      </section>
    </main>
  );
}

function KpiSkeleton() {
  return (
    <Card className="shadow-card">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-3 w-40" />
      </CardContent>
    </Card>
  );
}

function ListSkeleton() {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <Skeleton className="h-4 w-40" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
