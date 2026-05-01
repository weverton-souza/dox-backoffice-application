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

export type ModuleStatus = "TRIAL" | "ACTIVE" | "GRACE" | "SUSPENDED" | "CANCELED" | "GRANTED";
export type ModuleSource = "TRIAL" | "BUNDLE" | "INDIVIDUAL" | "GRANT" | "PROMOTION";
export type BillingCycle = "MONTHLY" | "YEARLY";
export type BillingType = "PIX" | "BOLETO" | "CREDIT_CARD" | "UNDEFINED";

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

export interface AdminTenantSummary {
  id: string;
  name: string;
  vertical: Vertical;
  type: TenantType;
  schemaName: string;
  createdAt: string | null;
}

export interface AdminTenantOwner {
  userId: string;
  email: string;
  name: string;
}

export interface AdminSubscriptionInfo {
  id: string;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  billingType: BillingType;
  valueCents: number;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  nextDueDate: string | null;
  trialEnd: string | null;
  canceledAt: string | null;
}

export interface AdminBundleInfo {
  id: string;
  name: string;
  priceMonthlyCents: number;
  priceYearlyCents: number;
  seatsIncluded: number;
  trackingSlotsIncluded: number;
}

export interface AdminTenantModuleInfo {
  moduleId: string;
  status: ModuleStatus;
  source: ModuleSource;
  sourceId: string | null;
  activatedAt: string;
  expiresAt: string | null;
  priceLocked: boolean;
  finalPriceCents: number;
}

export interface AdminPaymentInfo {
  id: string;
  amountCents: number;
  status: string;
  billingType: BillingType;
  dueDate: string;
  paidAt: string | null;
  invoiceUrl: string | null;
}

export interface AdminTenantDetailResponse {
  tenant: AdminTenantSummary;
  owner: AdminTenantOwner | null;
  subscription: AdminSubscriptionInfo | null;
  bundle: AdminBundleInfo | null;
  modules: AdminTenantModuleInfo[];
  recentPayments: AdminPaymentInfo[];
}

export interface GrantModuleRequest {
  moduleId: string;
  expiresAt?: string | null;
  notes?: string | null;
}

export interface ExtendTrialRequest {
  days: number;
  notes?: string | null;
}

export interface PriceReasonRequest {
  reason: string;
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

export async function getTenantDetail(id: string): Promise<AdminTenantDetailResponse> {
  const response = await apiFetch(`/admin/tenants/${id}`);
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminTenantDetailResponse;
}

export async function grantModule(id: string, body: GrantModuleRequest): Promise<AdminTenantModuleInfo> {
  const response = await apiFetch(`/admin/tenants/${id}/grant-module`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminTenantModuleInfo;
}

export async function extendTrial(id: string, body: ExtendTrialRequest): Promise<AdminSubscriptionInfo> {
  const response = await apiFetch(`/admin/tenants/${id}/extend-trial`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminSubscriptionInfo;
}

export async function lockPrice(id: string, body: PriceReasonRequest): Promise<AdminTenantModuleInfo[]> {
  const response = await apiFetch(`/admin/tenants/${id}/lock-price`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminTenantModuleInfo[];
}

export async function unlockPrice(id: string, body: { reason?: string | null }): Promise<AdminTenantModuleInfo[]> {
  const response = await apiFetch(`/admin/tenants/${id}/unlock-price`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminTenantModuleInfo[];
}
