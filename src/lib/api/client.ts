import { getSessionToken } from "@/lib/auth/session";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly title: string,
    public readonly detail?: string,
  ) {
    super(detail ?? title);
  }
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function apiFetch(
  path: string,
  init: RequestInit & { skipAuth?: boolean } = {},
): Promise<Response> {
  const { skipAuth, ...rest } = init;
  const headers = new Headers(rest.headers);

  if (!skipAuth) {
    const token = await getSessionToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && rest.body) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers,
    cache: "no-store",
  });
}

export async function readProblemDetail(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as { title?: string; detail?: string };
    return new ApiError(
      response.status,
      body.title ?? "Erro inesperado",
      body.detail,
    );
  } catch {
    return new ApiError(response.status, "Erro inesperado");
  }
}
