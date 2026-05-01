import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { lockPrice } from "@/lib/api/tenants";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { reason?: string };
  const reason = body.reason?.trim();
  if (!reason) {
    return NextResponse.json({ title: "Motivo é obrigatório" }, { status: 400 });
  }

  try {
    const result = await lockPrice(id, { reason });
    return NextResponse.json(result);
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
