import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/proxy"

// Refreshes the Supabase session on every request and persists the refreshed
// auth cookies (server components can read but not write cookies, so without
// this sessions silently expire). Also redirects unauthenticated users off
// protected routes. Server-component guards remain as defense in depth.
export async function proxy(request: NextRequest) {
  // If Supabase env vars are absent in a deployment environment, degrade to
  // a pass-through (server-component guards still protect routes) rather
  // than failing every request at the edge.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return NextResponse.next()
  }

  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
