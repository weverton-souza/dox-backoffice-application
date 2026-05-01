import { apiFetch, readProblemDetail } from "@/lib/api/client";
import type { AdminPagedResponse } from "@/lib/api/tenants";

export type StudentVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface AdminStudentVerification {
  id: string;
  tenantId: string;
  userId: string;
  documentUrl: string;
  institution: string | null;
  course: string | null;
  expectedGraduation: string | null;
  status: StudentVerificationStatus;
  reviewedByAdminId: string | null;
  reviewedAt: string | null;
  notes: string | null;
  rejectionReason: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CreateStudentVerificationRequest {
  tenantId: string;
  userId: string;
  documentUrl: string;
  institution?: string | null;
  course?: string | null;
  expectedGraduation?: string | null;
  notes?: string | null;
}

export interface ApproveRequest {
  notes?: string | null;
}

export interface RejectRequest {
  rejectionReason: string;
}

export async function listStudentVerifications(params: {
  status?: StudentVerificationStatus;
  page?: number;
  size?: number;
}): Promise<AdminPagedResponse<AdminStudentVerification>> {
  const search = new URLSearchParams();
  if (params.status) search.set("status", params.status);
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.size !== undefined) search.set("size", String(params.size));
  const response = await apiFetch(
    `/admin/student-verifications${search.size ? `?${search}` : ""}`,
  );
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminPagedResponse<AdminStudentVerification>;
}

export async function createStudentVerification(
  body: CreateStudentVerificationRequest,
): Promise<AdminStudentVerification> {
  const response = await apiFetch("/admin/student-verifications/manual", {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminStudentVerification;
}

export async function getStudentVerification(id: string): Promise<AdminStudentVerification> {
  const response = await apiFetch(`/admin/student-verifications/${id}`);
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminStudentVerification;
}

export async function approveStudent(
  id: string,
  body: ApproveRequest,
): Promise<AdminStudentVerification> {
  const response = await apiFetch(`/admin/student-verifications/${id}/approve`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminStudentVerification;
}

export async function rejectStudent(
  id: string,
  body: RejectRequest,
): Promise<AdminStudentVerification> {
  const response = await apiFetch(`/admin/student-verifications/${id}/reject`, {
    method: "POST",
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await readProblemDetail(response);
  return (await response.json()) as AdminStudentVerification;
}
