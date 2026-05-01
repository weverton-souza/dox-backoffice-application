import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { grantModule, type GrantModuleRequest } from "@/lib/api/tenants";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as Partial<GrantModuleRequest>;
  if (!body.moduleId) {
    return NextResponse.json({ title: "Módulo é obrigatório" }, { status: 400 });
  }

  try {
    const result = await grantModule(id, {
      moduleId: body.moduleId,
      expiresAt: body.expiresAt ?? null,
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
