import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { createBundle, listCatalogBundles, type CreateBundleRequest } from "@/lib/api/catalog";

export async function GET() {
  try {
    const result = await listCatalogBundles();
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

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as CreateBundleRequest;
  try {
    const result = await createBundle(body);
    return NextResponse.json(result, { status: 201 });
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
