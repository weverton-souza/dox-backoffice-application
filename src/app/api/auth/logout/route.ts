import { NextResponse } from "next/server";
import { logoutAdmin } from "@/lib/api/auth";
import { clearSessionToken } from "@/lib/auth/session";

export async function POST() {
  try {
    await logoutAdmin();
  } catch {
    // ignora — logout do backend é no-op, vamos limpar o cookie de qualquer forma
  }
  await clearSessionToken();
  return NextResponse.json({ ok: true });
}
