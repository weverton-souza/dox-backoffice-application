import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { fetchAdminMe } from "@/lib/api/auth";

export async function GET() {
  try {
    const me = await fetchAdminMe();
    if (!me) return NextResponse.json({ title: "Não autenticado" }, { status: 401 });
    return NextResponse.json(me);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { title: error.title, detail: error.detail },
        { status: error.status },
      );
    }
    return NextResponse.json({ title: "Erro inesperado" }, { status: 500 });
  }
}
