import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { unlockPrice } from "@/lib/api/tenants";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { reason?: string | null };

  try {
    const result = await unlockPrice(id, { reason: body.reason ?? null });
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
