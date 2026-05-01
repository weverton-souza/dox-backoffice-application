import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { approveStudent, type ApproveRequest } from "@/lib/api/students";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as ApproveRequest;
  try {
    const result = await approveStudent(id, body);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.title, detail: error.detail }, { status: error.status });
    }
    return NextResponse.json({ title: "Erro inesperado" }, { status: 500 });
  }
}
