import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { backfillSnapshots } from "@/lib/api/dashboard";

export async function POST(request: Request) {
  const url = new URL(request.url);
  const monthsParam = url.searchParams.get("months");
  const months = monthsParam ? Number(monthsParam) : 12;
  const safeMonths = Number.isFinite(months) ? Math.max(1, Math.min(36, Math.trunc(months))) : 12;
  try {
    const result = await backfillSnapshots(safeMonths);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.title, detail: error.detail }, { status: error.status });
    }
    return NextResponse.json({ title: "Erro inesperado" }, { status: 500 });
  }
}
