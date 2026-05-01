import { NextResponse } from "next/server";
import { ApiError } from "@/lib/api/client";
import { loginAdmin } from "@/lib/api/auth";
import { setSessionToken } from "@/lib/auth/session";

interface LoginRequestBody {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LoginRequestBody;
  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { title: "Email e senha são obrigatórios" },
      { status: 400 },
    );
  }

  try {
    const result = await loginAdmin(email, password);
    await setSessionToken(result.accessToken);
    return NextResponse.json({
      adminId: result.adminId,
      email: result.email,
      name: result.name,
      role: result.role,
    });
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
