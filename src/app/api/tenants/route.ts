import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { listTenants } from "@/lib/api/tenants";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get("search") ?? undefined;
  const page = url.searchParams.get("page");
  const size = url.searchParams.get("size");

  try {
    const result = await listTenants({
      search,
      page: page ? Number(page) : undefined,
      size: size ? Number(size) : undefined,
    });
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
