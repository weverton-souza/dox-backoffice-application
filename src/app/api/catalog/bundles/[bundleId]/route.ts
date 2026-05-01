import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { updateBundle, type UpdateBundleRequest } from "@/lib/api/catalog";

export async function PUT(
  request: Request,
  context: { params: Promise<{ bundleId: string }> },
) {
  const { bundleId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as UpdateBundleRequest;

  try {
    const result = await updateBundle(bundleId, body);
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
