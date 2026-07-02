"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(searchParams.get("search") || "")
  // Search updates re-render the page on the server without a route change,
  // so no loading.tsx fallback appears — the spinner is the only signal.
  const [isPending, startTransition] = useTransition()

  const updateSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (term) {
        params.set("search", term)
      } else {
        params.delete("search")
      }
      startTransition(() => {
        router.replace(`?${params.toString()}`, { scroll: false })
      })
    },
    [router, searchParams]
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearch(value)
    }, 300)
    return () => clearTimeout(timer)
  }, [value, updateSearch])

  return (
    <div className="relative">
      {isPending ? (
        <Loader2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      ) : (
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        placeholder="Search..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}
