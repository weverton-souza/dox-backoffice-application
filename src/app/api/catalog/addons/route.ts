import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { createAddon, listCatalogAddons, type CreateAddonRequest } from "@/lib/api/catalog";

export async function GET() {
  try {
    const result = await listCatalogAddons();
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
  const body = (await request.json().catch(() => ({}))) as CreateAddonRequest;
  try {
    const result = await createAddon(body);
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
