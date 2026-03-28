import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  createHref?: string
  createLabel?: string
}

export function EmptyState({
  title,
  description,
  createHref,
  createLabel,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm">
        {description}
      </p>
      {createHref && (
        <Link href={createHref} className={buttonVariants({ className: "mt-4" })}>
          <Plus className="mr-2 h-4 w-4" />
          {createLabel || "Create"}
        </Link>
      )}
    </div>
  )
}
