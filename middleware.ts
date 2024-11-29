import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Ensure that `secret` is provided when using getToken
export async function middleware(req: Request) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });

  const url = req.url;

  // Redirect authenticated users from guest routes
  if (url.includes("/sign-in") && token) {
    return NextResponse.redirect(new URL("/", url));
  }

  // Redirect unauthenticated users from the root
  if (url === "/" && !token) {
    return NextResponse.redirect(new URL("/sign-in", url));
  }

  return NextResponse.next();
}
