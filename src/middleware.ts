import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { verifyAdminToken } from "./lib/auth-edge";

const intlMiddleware = createIntlMiddleware(routing);

const ADMIN_LOGIN_PATHS = ["/fr/admin/login", "/en/admin/login", "/de/admin/login"];

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an admin route (but not the login page itself)
  const isAdminRoute = /^\/(?:fr|en|de)\/admin/.test(pathname);
  const isLoginPage = ADMIN_LOGIN_PATHS.some((p) => pathname === p || pathname.startsWith(p));

  if (isAdminRoute && !isLoginPage) {
    const token = request.cookies.get("admin_token")?.value;
    const isAuthenticated = token ? verifyAdminToken(token) : false;

    if (!isAuthenticated) {
      // Extract locale from path
      const locale = pathname.split("/")[1] || "fr";
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Let next-intl handle locale routing
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
