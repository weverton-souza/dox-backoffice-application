import { apiFetch, readProblemDetail } from "@/lib/api/client";

export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface AdminAuthResponse {
  accessToken: string;
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
}

export interface AdminMeResponse {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  lastLoginAt: string | null;
}

export async function loginAdmin(email: string, password: string): Promise<AdminAuthResponse> {
  const response = await apiFetch("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    skipAuth: true,
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminAuthResponse;
}

export async function logoutAdmin(): Promise<void> {
  const response = await apiFetch("/admin/auth/logout", { method: "POST" });
  if (!response.ok && response.status !== 401) {
    throw await readProblemDetail(response);
  }
}

export async function fetchAdminMe(): Promise<AdminMeResponse | null> {
  const response = await apiFetch("/admin/auth/me");
  if (response.status === 401) return null;
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminMeResponse;
}
