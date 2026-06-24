import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PLAN_LIMITS, planLabel, type PlanId } from "@/lib/pricing"
import { cn } from "@/lib/utils"

interface Usage {
  users: number
  prompts: number
  workflows: number
  agents: number
  images: number
}

const METRICS: { key: keyof Usage; label: string }[] = [
  { key: "users", label: "Users" },
  { key: "prompts", label: "Prompts" },
  { key: "workflows", label: "Workflows" },
  { key: "agents", label: "Agents" },
  { key: "images", label: "Image assets" },
]

export function PlanUsageCard({
  plan,
  usage,
  actions,
}: {
  plan: string
  usage: Usage
  actions?: ReactNode
}) {
  const planId = (["personal", "starter", "team", "enterprise"].includes(plan)
    ? plan
    : "personal") as PlanId
  const limits = PLAN_LIMITS[planId]
  const overLimit = METRICS.some(({ key }) => {
    const limit = limits[key]
    return limit !== null && usage[key] > limit
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          Plan &amp; Usage
          <Badge variant="secondary">{planLabel(planId)}</Badge>
        </CardTitle>
        {actions}
      </CardHeader>
      <CardContent className="space-y-4">
        {overLimit && (
          <p className="text-sm text-amber-700 dark:text-amber-500">
            You&apos;re over your plan&apos;s limits. Upgrade to keep adding without limits.
          </p>
        )}
        {METRICS.map(({ key, label }) => {
          const used = usage[key]
          const limit = limits[key]
          const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0
          const over = limit !== null && used > limit
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">
                  {used}
                  {limit !== null ? ` / ${limit}` : " · Unlimited"}
                </span>
              </div>
              {limit !== null && (
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full", over ? "bg-amber-500" : "bg-primary")}
                    style={{ width: `${Math.max(pct, used > 0 ? 4 : 0)}%` }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
