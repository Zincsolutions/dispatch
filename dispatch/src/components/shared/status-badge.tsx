import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  experimental: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200",
  needs_review:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  approved:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
  archived: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn("capitalize", statusStyles[status])}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  )
}
