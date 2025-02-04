// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Only protect the homepage ("/") and pages under "/order/"
  const protect = pathname === "/" || pathname.startsWith("/order/");

  // Always allow requests for public routes (login, api/auth, _next, static files)
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // If the route should be protected...
  if (protect) {
    // Retrieve the token
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log("Middleware token:", token);
    if (!token) {
      console.log("No token found; redirecting to /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}
