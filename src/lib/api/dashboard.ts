import { apiFetch, readProblemDetail } from "@/lib/api/client";
import type { BillingType, SubscriptionStatus, Vertical } from "@/lib/api/tenants";

export type DashboardPeriod = "CURRENT_MONTH" | "LAST_30D" | "LAST_90D" | "LAST_12M";

export const DASHBOARD_PERIODS: { value: DashboardPeriod; label: string }[] = [
  { value: "CURRENT_MONTH", label: "Mês atual" },
  { value: "LAST_30D", label: "Últimos 30 dias" },
  { value: "LAST_90D", label: "Últimos 90 dias" },
  { value: "LAST_12M", label: "Últimos 12 meses" },
];

export interface KpiCardResponse {
  current: number;
  previous: number;
  delta: number;
  deltaPct: number | null;
}

export interface OverdueResponse {
  overdueAmountCents: number;
  overdueCount: number;
  graceCount: number;
  suspendedCount: number;
}

export interface RevenuePointResponse {
  year: number;
  month: number;
  totalCents: number;
}

export interface MethodRevenueResponse {
  billingType: BillingType;
  totalCents: number;
  paymentCount: number;
}

export interface ModuleRevenueResponse {
  moduleId: string;
  mrrCents: number;
  activeCount: number;
}

export interface RecentSignupResponse {
  tenantId: string;
  tenantName: string;
  vertical: Vertical;
  createdAt: string;
  subscriptionStatus: SubscriptionStatus | null;
}

export interface TrialConversionResponse {
  started: number;
  converted: number;
  pct: number;
}

export interface ChurnPointResponse {
  year: number;
  month: number;
  churnRatePct: number;
  canceled: number;
  activeAtStart: number;
}

export interface RevenueSnapshotResponse {
  year: number;
  month: number;
  mrrCents: number;
  arrCents: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  overdueAmountCents: number;
  newSignups: number;
  canceledSubscriptions: number;
  trialStarted: number;
  trialConverted: number;
  capturedAt: string;
}

export interface BackfillSnapshotsResponse {
  captured: RevenueSnapshotResponse[];
}

export interface AdminDashboardResponse {
  period: DashboardPeriod;
  periodStart: string;
  periodEnd: string;
  mrr: KpiCardResponse;
  arr: KpiCardResponse;
  activeSubscriptions: KpiCardResponse;
  trials: KpiCardResponse;
  signupsInPeriod: KpiCardResponse;
  churnRatePct: number | null;
  ltvCents: number | null;
  trialConversion: TrialConversionResponse | null;
  overdue: OverdueResponse;
  revenueLast12Months: RevenuePointResponse[];
  churnLast12Months: ChurnPointResponse[];
  revenueByMethod: MethodRevenueResponse[];
  topModulesByRevenue: ModuleRevenueResponse[];
  recentSignups: RecentSignupResponse[];
}

export async function getDashboard(period: DashboardPeriod = "CURRENT_MONTH"): Promise<AdminDashboardResponse> {
  const response = await apiFetch(`/admin/dashboard?period=${period}`);
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminDashboardResponse;
}

export async function backfillSnapshots(months = 12): Promise<BackfillSnapshotsResponse> {
  const response = await apiFetch(`/admin/dashboard/snapshots/backfill?months=${months}`, {
    method: "POST",
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as BackfillSnapshotsResponse;
}

export function isDashboardPeriod(value: string | undefined | null): value is DashboardPeriod {
  return value === "CURRENT_MONTH" || value === "LAST_30D" || value === "LAST_90D" || value === "LAST_12M";
}
