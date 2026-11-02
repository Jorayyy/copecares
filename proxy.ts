import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { ADMIN_ROLES, homeForRole } from "@/lib/auth-routes";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  const role = session?.user?.role;
  const isLoggedIn = Boolean(session?.user);

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password";

  const isAdminArea = pathname.startsWith("/admin");
  const isPetOwnerArea = pathname.startsWith("/pet-owner");

  if (isAuthPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(homeForRole(role), req.nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && (isAdminArea || isPetOwnerArea)) {
    const loginUrl = new URL("/login", req.nextUrl);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${req.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminArea && role && !ADMIN_ROLES.includes(role)) {
    return NextResponse.redirect(new URL(homeForRole(role), req.nextUrl));
  }

  if (isPetOwnerArea && role && role !== "pet_owner") {
    return NextResponse.redirect(new URL(homeForRole(role), req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)",
  ],
};
