import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { extendTrial, type ExtendTrialRequest } from "@/lib/api/tenants";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Partial<ExtendTrialRequest>;
  if (typeof body.days !== "number" || body.days < 1) {
    return NextResponse.json({ title: "Dias deve ser positivo" }, { status: 400 });
  }

  try {
    const result = await extendTrial(id, {
      days: body.days,
      notes: body.notes ?? null,
    });
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
