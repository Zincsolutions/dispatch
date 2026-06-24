import { Check } from "lucide-react"

const PLAN_DETAILS: Record<string, { label: string; detail: string }> = {
  personal: { label: "Personal plan", detail: "Free forever · for individuals" },
  free: { label: "Personal plan", detail: "Free forever · for individuals" },
  starter: { label: "Starter plan", detail: "$29/mo · up to 10 users" },
  team: { label: "Team plan", detail: "$99/mo · up to 50 users · governance" },
  enterprise: { label: "Enterprise", detail: "Custom setup — our team will tailor your plan" },
}

export function SelectedPlanBanner({ plan }: { plan?: string }) {
  const details = plan ? PLAN_DETAILS[plan] : undefined
  if (!details) return null

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Check className="h-3.5 w-3.5 text-primary" strokeWidth={3} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-tight">{details.label} selected</p>
        <p className="text-xs text-muted-foreground leading-tight">{details.detail}</p>
      </div>
    </div>
  )
}
