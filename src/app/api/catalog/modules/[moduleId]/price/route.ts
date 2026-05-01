import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { updateModulePrice, type UpdateModulePriceRequest } from "@/lib/api/catalog";

export async function PUT(
  request: Request,
  context: { params: Promise<{ moduleId: string }> },
) {
  const { moduleId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Partial<UpdateModulePriceRequest>;
  if (typeof body.priceCents !== "number" || body.priceCents < 0) {
    return NextResponse.json(
      { title: "Preço deve ser maior ou igual a zero" },
      { status: 400 },
    );
  }

  try {
    const result = await updateModulePrice(moduleId, {
      priceCents: body.priceCents,
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
