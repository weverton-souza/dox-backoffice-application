import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { rejectStudent, type RejectRequest } from "@/lib/api/students";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as RejectRequest;
  if (!body.rejectionReason?.trim()) {
    return NextResponse.json({ title: "Motivo da rejeição é obrigatório" }, { status: 400 });
  }
  try {
    const result = await rejectStudent(id, body);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ title: error.title, detail: error.detail }, { status: error.status });
    }
    return NextResponse.json({ title: "Erro inesperado" }, { status: 500 });
  }
}
