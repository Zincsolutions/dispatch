import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// Routes reachable without a session. Everything else requires auth.
const PUBLIC_PATHS = [
  "/",
  "/product",
  "/privacy",
  "/terms",
  "/pricing",
  "/contact",
  "/resources",
  "/faq",
]
// Prefix matches cover nested routes (e.g. /blog/<slug>, /solutions/use-cases).
const PUBLIC_PREFIXES = [
  "/login",
  "/signup",
  "/auth",
  "/invite",
  "/blog",
  "/solutions",
]

function isPublicPath(path: string) {
  return (
    PUBLIC_PATHS.includes(path) ||
    PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix))
  )
}

// Supabase SSR stores the session as `sb-<project-ref>-auth-token` cookies
// (chunked into `.0`, `.1`, ... suffixes when large). Presence is a cheap
// local signal that lets us skip the auth server round-trip entirely for
// anonymous visitors.
function hasSessionCookie(request: NextRequest) {
  return request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.includes("-auth-token"))
}

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublic = isPublicPath(path)
  const isAuthPage = path === "/login" || path === "/signup"

  // Anonymous visitor: nothing to verify or refresh. Public pages pass
  // straight through; protected pages bounce to /login. Either way the
  // response is not gated on a Supabase round-trip.
  if (!hasSessionCookie(request)) {
    if (isPublic) {
      return NextResponse.next({ request })
    }
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.search = ""
    return NextResponse.redirect(url)
  }

  // Signed-in visitor on a public page: only /login and /signup change
  // behavior based on auth state, so everything else skips verification.
  // The session refreshes on the next app-route request instead.
  if (isPublic && !isAuthPage) {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() refreshes an expired access token; the setAll handler above
  // writes the refreshed cookies onto the response so the session persists.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.search = ""
    return NextResponse.redirect(url)
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    url.search = ""
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
