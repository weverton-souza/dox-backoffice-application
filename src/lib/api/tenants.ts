import { apiFetch, readProblemDetail } from "@/lib/api/client";

export type SubscriptionStatus =
  | "TRIAL"
  | "TRIAL_GRACE"
  | "ACTIVE"
  | "GRACE"
  | "SUSPENDED"
  | "CANCEL_PENDING"
  | "CANCELED";

export type Vertical =
  | "GENERAL"
  | "HEALTH"
  | "LEGAL"
  | "EDUCATION"
  | "ENGINEERING"
  | "ACCOUNTING"
  | "ENVIRONMENT"
  | "SAFETY"
  | "TECHNOLOGY"
  | "NUTRITION"
  | "VETERINARY"
  | "FORENSICS"
  | "SOCIAL_WORK"
  | "AGRONOMY";

export type TenantType = "PERSONAL" | "ORGANIZATION";

export interface AdminTenantListItem {
  id: string;
  name: string;
  vertical: Vertical;
  type: TenantType;
  subscriptionStatus: SubscriptionStatus | null;
  mrrCents: number | null;
  createdAt: string | null;
}

export interface AdminPagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ListTenantsParams {
  search?: string;
  page?: number;
  size?: number;
}

export async function listTenants(params: ListTenantsParams = {}): Promise<AdminPagedResponse<AdminTenantListItem>> {
  const search = new URLSearchParams();
  if (params.search) search.set("search", params.search);
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.size !== undefined) search.set("size", String(params.size));
  const query = search.toString();

  const response = await apiFetch(`/admin/tenants${query ? `?${query}` : ""}`);
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminPagedResponse<AdminTenantListItem>;
}
