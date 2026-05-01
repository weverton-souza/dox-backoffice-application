import { apiFetch, readProblemDetail } from "@/lib/api/client";

export type AddonType = "MODULE" | "SLOT_QUOTA" | "SEAT_QUOTA" | "PERCENTAGE_FEE";

export interface AdminAddonListItem {
  id: string;
  name: string;
  description: string | null;
  type: AddonType;
  targetModuleId: string | null;
  priceMonthlyCents: number;
  priceUnitCents: number | null;
  feePercentage: string | null;
  availableForBundles: string[];
  active: boolean;
  sortOrder: number;
  updatedAt: string | null;
}

export interface UpdateAddonRequest {
  priceMonthlyCents?: number | null;
  priceUnitCents?: number | null;
  feePercentage?: string | null;
  active?: boolean | null;
  availableForBundles?: string[] | null;
  sortOrder?: number | null;
  notes?: string | null;
}

export interface AdminBundleListItem {
  id: string;
  name: string;
  description: string | null;
  modules: string[];
  priceMonthlyCents: number;
  priceYearlyCents: number;
  seatsIncluded: number;
  trackingSlotsIncluded: number;
  highlighted: boolean;
  active: boolean;
  sortOrder: number;
  updatedAt: string | null;
}

export interface UpdateBundleRequest {
  priceMonthlyCents?: number | null;
  priceYearlyCents?: number | null;
  description?: string | null;
  seatsIncluded?: number | null;
  trackingSlotsIncluded?: number | null;
  highlighted?: boolean | null;
  sortOrder?: number | null;
  notes?: string | null;
}

export interface AdminModuleListItem {
  moduleId: string;
  displayName: string;
  dependencies: string[];
  basePriceCents: number;
  currentPriceCents: number | null;
  currentValidFrom: string | null;
  hasFallback: boolean;
}

export interface AdminModulePriceResponse {
  id: string;
  moduleId: string;
  priceCents: number;
  currency: string;
  validFrom: string;
  validUntil: string | null;
  notes: string | null;
  createdByUserId: string | null;
  createdAt: string | null;
}

export interface UpdateModulePriceRequest {
  priceCents: number;
  notes?: string | null;
}

export async function listCatalogModules(): Promise<AdminModuleListItem[]> {
  const response = await apiFetch("/admin/catalog/modules");
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminModuleListItem[];
}

export async function updateModulePrice(
  moduleId: string,
  body: UpdateModulePriceRequest,
): Promise<AdminModulePriceResponse> {
  const response = await apiFetch(`/admin/catalog/modules/${moduleId}/price`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminModulePriceResponse;
}

export async function listModulePriceHistory(
  moduleId: string,
  limit = 20,
): Promise<AdminModulePriceResponse[]> {
  const response = await apiFetch(
    `/admin/catalog/modules/${moduleId}/history?limit=${limit}`,
  );
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminModulePriceResponse[];
}

export async function listCatalogBundles(): Promise<AdminBundleListItem[]> {
  const response = await apiFetch("/admin/catalog/bundles");
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminBundleListItem[];
}

export async function updateBundle(
  bundleId: string,
  body: UpdateBundleRequest,
): Promise<AdminBundleListItem> {
  const response = await apiFetch(`/admin/catalog/bundles/${bundleId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminBundleListItem;
}

export async function listCatalogAddons(): Promise<AdminAddonListItem[]> {
  const response = await apiFetch("/admin/catalog/addons");
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminAddonListItem[];
}

export async function updateAddon(
  addonId: string,
  body: UpdateAddonRequest,
): Promise<AdminAddonListItem> {
  const response = await apiFetch(`/admin/catalog/addons/${addonId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminAddonListItem;
}
