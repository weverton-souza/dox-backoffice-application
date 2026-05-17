import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { archiveBundle, type ArchiveCatalogRequest } from "@/lib/api/catalog";

export async function POST(
  request: Request,
  context: { params: Promise<{ bundleId: string }> },
) {
  const { bundleId } = await context.params;
  const body = (await request.json().catch(() => ({}))) as ArchiveCatalogRequest;
  try {
    const result = await archiveBundle(bundleId, body);
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
