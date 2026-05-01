import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { listCatalogAddons } from "@/lib/api/catalog";

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
