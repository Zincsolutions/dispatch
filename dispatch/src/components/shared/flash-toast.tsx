"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

const MESSAGES: Record<string, string> = {
  created: "Created",
  saved: "Changes saved",
  deleted: "Deleted",
}

// Server actions finish with redirect(), so the client code that called them
// never gets a chance to toast. They append ?flash=<key> instead; this
// component (mounted once in the app layout) shows the toast and strips the
// param so refreshes and shared links don't re-announce it.
export function FlashToast() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const announced = useRef<string | null>(null)

  const flash = searchParams.get("flash")

  useEffect(() => {
    if (!flash || !MESSAGES[flash]) return
    const key = `${pathname}?${flash}`
    if (announced.current === key) return
    announced.current = key

    toast.success(MESSAGES[flash])

    const params = new URLSearchParams(searchParams.toString())
    params.delete("flash")
    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [flash, pathname, router, searchParams])

  return null
}
