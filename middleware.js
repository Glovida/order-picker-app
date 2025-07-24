// middleware.js
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Define public routes that should not require authentication
  const isPublic = pathname.startsWith("/login") ||
                   pathname.startsWith("/api/auth") ||
                   pathname.startsWith("/_next/") ||
                   pathname.includes(".");

  // Protect all routes except the public ones
  const protect = !isPublic;

  // Always allow requests for public routes
  if (isPublic) {
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
