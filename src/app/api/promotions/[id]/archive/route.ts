import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { archivePromotion } from "@/lib/api/promotions";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const result = await archivePromotion(id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.title, detail: error.detail }, { status: error.status });
    }
    return NextResponse.json({ title: "Erro inesperado" }, { status: 500 });
  }
}
