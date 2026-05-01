import { apiFetch, readProblemDetail } from "@/lib/api/client";

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
