import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { createPromotion, listPromotions, type CreatePromotionRequest } from "@/lib/api/promotions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const includeArchived = url.searchParams.get("includeArchived") === "true";
  const page = url.searchParams.get("page");
  const size = url.searchParams.get("size");
  try {
    const result = await listPromotions({
      includeArchived,
      page: page ? Number(page) : undefined,
      size: size ? Number(size) : undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.title, detail: error.detail }, { status: error.status });
    }
    return NextResponse.json({ title: "Erro inesperado" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CreatePromotionRequest;
  try {
    const result = await createPromotion(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.title, detail: error.detail }, { status: error.status });
    }
    return NextResponse.json({ title: "Erro inesperado" }, { status: 500 });
  }
}
