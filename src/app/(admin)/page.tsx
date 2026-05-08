import { CreditCard, Heart, Repeat, TrendingDown, TrendingUp, UserPlus, Users, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboard, isDashboardPeriod, type DashboardPeriod } from "@/lib/api/dashboard";
import KpiCard from "./KpiCard";
import MetricCard from "./MetricCard";
import OverdueCard from "./OverdueCard";
import RevenueChart from "./RevenueChart";
import PeriodSelector from "./PeriodSelector";
import MethodDistribution from "./MethodDistribution";
import TopModulesList from "./TopModulesList";
import RecentSignupsList from "./RecentSignupsList";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const pctFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { period: periodParam } = await searchParams;
  const period: DashboardPeriod = isDashboardPeriod(periodParam) ? periodParam : "CURRENT_MONTH";
  const data = await getDashboard(period);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
        <PeriodSelector value={period} />
      </div>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="MRR" icon={Wallet} data={data.mrr} format="currency" />
        <KpiCard title="ARR" icon={TrendingUp} data={data.arr} format="currency" />
        <KpiCard title="Assinaturas ativas" icon={Users} data={data.activeSubscriptions} format="count" />
        <KpiCard title="Trials" icon={UserPlus} data={data.trials} format="count" />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="Churn rate"
          icon={TrendingDown}
          value={data.churnRatePct !== null ? `${pctFormatter.format(data.churnRatePct)}%` : "—"}
          empty={data.churnRatePct === null}
          hint="último mês"
        />
        <MetricCard
          title="LTV estimado"
          icon={Heart}
          value={data.ltvCents !== null ? currencyFormatter.format(data.ltvCents / 100) : "—"}
          empty={data.ltvCents === null}
          hint="ARPU ÷ churn mensal"
        />
        <MetricCard
          title="Conversão de trial"
          icon={Repeat}
          value={
            data.trialConversion && data.trialConversion.started > 0
              ? `${pctFormatter.format(data.trialConversion.pct)}%`
              : "—"
          }
          empty={!data.trialConversion || data.trialConversion.started === 0}
          hint={
            data.trialConversion
              ? `${data.trialConversion.converted} de ${data.trialConversion.started} (30d)`
              : "30d"
          }
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <OverdueCard data={data.overdue} />
        <KpiCard
          title="Cadastros no período"
          icon={UserPlus}
          data={data.signupsInPeriod}
          format="count"
        />
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pagamentos no período
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight text-foreground">
              {data.revenueByMethod.reduce((sum, r) => sum + r.paymentCount, 0)}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              soma de transações confirmadas no período
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Receita últimos 12 meses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart points={data.revenueLast12Months} />
          </CardContent>
        </Card>
        <MethodDistribution rows={data.revenueByMethod} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TopModulesList rows={data.topModulesByRevenue} />
        <RecentSignupsList rows={data.recentSignups} />
      </section>
    </main>
  );
}
