import { apiFetch, readProblemDetail } from "@/lib/api/client";
import type {
  AdminDashboardResponse,
  BackfillSnapshotsResponse,
  DashboardPeriod,
} from "@/lib/api/dashboard-types";

export * from "@/lib/api/dashboard-types";

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
