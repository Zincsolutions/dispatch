import { Check } from "lucide-react"

const PLAN_DETAILS: Record<string, { label: string; detail: string }> = {
  free: { label: "Free plan", detail: "1 workspace · 2 users · 25 AI assets to start" },
  starter: { label: "Starter plan", detail: "$19/mo · 5 users · 100 AI assets" },
  team: { label: "Team plan", detail: "$79/mo · 25 users · 1,000 AI assets" },
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
