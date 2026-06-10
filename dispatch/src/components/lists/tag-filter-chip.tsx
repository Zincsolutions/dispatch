import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

// Shows the active ?tag= filter with a clear affordance.
export function TagFilterChip({ tag, basePath }: { tag: string; basePath: string }) {
  return (
    <Link href={basePath} className="inline-flex">
      <Badge variant="secondary" className="gap-1 hover:bg-secondary/80">
        Tag: {tag}
        <X className="h-3 w-3" />
      </Badge>
    </Link>
  )
}
