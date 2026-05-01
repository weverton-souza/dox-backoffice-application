import { NextResponse, type NextRequest } from "next/server";

const COOKIE_NAME = "admin_session";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isLogin = request.nextUrl.pathname === "/login";

  if (!token && !isLogin) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  if (token && isLogin) {
    const url = new URL("/tenants", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\..*).*)",
  ],
};
