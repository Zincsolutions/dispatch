import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    throw new Error(
      `Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL=${!!url}, NEXT_PUBLIC_SUPABASE_ANON_KEY=${!!key}`
    )
  }

  return createBrowserClient(url, key)
}
