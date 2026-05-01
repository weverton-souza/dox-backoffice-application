import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { listModulePriceHistory } from "@/lib/api/catalog";

export async function GET(
  request: Request,
  context: { params: Promise<{ moduleId: string }> },
) {
  const { moduleId } = await context.params;
  const url = new URL(request.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Math.max(1, Math.min(100, Number(limitParam))) : 20;

  try {
    const result = await listModulePriceHistory(moduleId, limit);
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
