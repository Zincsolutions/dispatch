import { NextResponse, type NextRequest } from "next/server"

// Auth checks are handled in server components (app layout + page wrappers),
// not in middleware. This avoids depending on Supabase env vars at the
// middleware/edge layer, which aren't available in all deployment environments.
export function proxy(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
