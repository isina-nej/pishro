import type { NextResponse } from "next/server";

/**
 * Admin access-token cookie flags.
 *
 * httpOnly=true blocks XSS theft via document.cookie. Authenticated browser
 * navigation still sends it automatically, and JS API calls attach the token
 * from localStorage as Bearer (see lib/api-client.ts) — so nothing needs to
 * read the cookie from JS.
 */
export function setAdminAccessCookie(
  res: NextResponse,
  token: string,
  maxAge: number
): void {
  res.cookies.set("admin_access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

export function clearAdminAccessCookie(res: NextResponse): void {
  res.cookies.set("admin_access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
