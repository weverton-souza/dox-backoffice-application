import { apiFetch, readProblemDetail } from "@/lib/api/client";
import type { AdminPagedResponse } from "@/lib/api/tenants";

export type PromotionType =
  | "COUPON"
  | "BUNDLE"
  | "GRANT"
  | "REFERRAL"
  | "LOYALTY"
  | "WINBACK"
  | "CAMPAIGN"
  | "PARTNER"
  | "TRIAL_EXTENSION"
  | "VOLUME_DISCOUNT"
  | "CROSS_SELL"
  | "ANNIVERSARY";

export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_MONTHS" | "TRIAL_EXTENSION_DAYS";
export type DurationType = "ONCE" | "FOREVER" | "FIXED_MONTHS";
export type AppliesTo = "ALL_MODULES" | "SPECIFIC_MODULES" | "MIN_BUNDLE" | "FIRST_PAYMENT_ONLY";

export interface AdminPromotion {
  id: string;
  code: string | null;
  name: string;
  type: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  durationType: DurationType;
  durationMonths: number | null;
  maxRedemptions: number | null;
  currentRedemptions: number;
  validFrom: string | null;
  validUntil: string | null;
  appliesTo: AppliesTo;
  appliesToModules: string[];
  appliesToVerticals: string[];
  appliesToSignupAfter: string | null;
  appliesToSignupBefore: string | null;
  stackableWith: string[];
  skipProration: boolean;
  requiresApproval: boolean;
  autoApplyEvent: string | null;
  createdAt: string | null;
  createdByUserId: string | null;
  archivedAt: string | null;
}

export interface AdminPromotionStats {
  promotionId: string;
  currentRedemptions: number;
  maxRedemptions: number | null;
  activeTenantIds: string[];
}

export interface CreatePromotionRequest {
  code?: string | null;
  name: string;
  type: PromotionType;
  discountType: DiscountType;
  discountValue: number;
  durationType: DurationType;
  durationMonths?: number | null;
  maxRedemptions?: number | null;
  validFrom?: string | null;
  validUntil?: string | null;
  appliesTo: AppliesTo;
  appliesToModules?: string[];
}

export interface UpdatePromotionRequest {
  name?: string;
  maxRedemptions?: number | null;
  validFrom?: string | null;
  validUntil?: string | null;
  appliesToModules?: string[];
}

export async function listPromotions(params: {
  includeArchived?: boolean;
  page?: number;
  size?: number;
}): Promise<AdminPagedResponse<AdminPromotion>> {
  const search = new URLSearchParams();
  if (params.includeArchived) search.set("includeArchived", "true");
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.size !== undefined) search.set("size", String(params.size));
  const response = await apiFetch(`/admin/promotions${search.size ? `?${search}` : ""}`);
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminPagedResponse<AdminPromotion>;
}

export async function createPromotion(body: CreatePromotionRequest): Promise<AdminPromotion> {
  const response = await apiFetch("/admin/promotions", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminPromotion;
}

export async function updatePromotion(id: string, body: UpdatePromotionRequest): Promise<AdminPromotion> {
  const response = await apiFetch(`/admin/promotions/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminPromotion;
}

export async function archivePromotion(id: string): Promise<AdminPromotion> {
  const response = await apiFetch(`/admin/promotions/${id}/archive`, { method: "POST" });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminPromotion;
}

export async function getPromotionStats(id: string): Promise<AdminPromotionStats> {
  const response = await apiFetch(`/admin/promotions/${id}/stats`);
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminPromotionStats;
}
