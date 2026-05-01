import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { getTenantDetail } from "@/lib/api/tenants";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  try {
    const detail = await getTenantDetail(id);
    return NextResponse.json(detail);
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
