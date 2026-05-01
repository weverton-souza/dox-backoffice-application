import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { updatePromotion, type UpdatePromotionRequest } from "@/lib/api/promotions";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as UpdatePromotionRequest;
  try {
    const result = await updatePromotion(id, body);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.title, detail: error.detail }, { status: error.status });
    }
    return NextResponse.json({ title: "Erro inesperado" }, { status: 500 });
  }
}
