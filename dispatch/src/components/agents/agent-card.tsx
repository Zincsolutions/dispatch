import Link from "next/link"
import { Bot } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
import { CopyButton } from "@/components/shared/copy-button"
import { buttonVariants } from "@/components/ui/button-variants"
import { DEPARTMENTS, RISK_LEVELS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { AgentWithOwner } from "@/lib/queries/agents"

const departmentLabel = (v: string | null) =>
  DEPARTMENTS.find((d) => d.value === v)?.label ?? v ?? null

const riskLabel = (v: string | null) =>
  RISK_LEVELS.find((r) => r.value === v)?.label ?? null

const riskColor: Record<string, string> = {
  low: "text-emerald-600",
  medium: "text-amber-600",
  high: "text-red-600",
}

function formatReviewed(date: string | null) {
  if (!date) return null
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// "Instructions" for the copy action — the operational guidance behind
// the agent, assembled from its description, purpose, and setup notes.
function buildInstructions(agent: AgentWithOwner) {
  return [agent.description, agent.purpose, agent.setup_notes]
    .filter((s) => s && s.trim())
    .join("\n\n")
}

export function AgentCard({ agent }: { agent: AgentWithOwner }) {
  const subtitle = [departmentLabel(agent.department), agent.category]
    .filter(Boolean)
    .join(" • ")
  const reviewed = formatReviewed(agent.last_reviewed)
  const risk = riskLabel(agent.risk_level)

  return (
    <div className="flex flex-col rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border bg-muted/40">
            <Bot className="h-5 w-5 text-muted-foreground" />
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight truncate">{agent.name}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      {/* Body */}
      {agent.description && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {agent.description}
        </p>
      )}

      {/* Governance metadata */}
      <div className="mt-4 space-y-1 text-xs text-muted-foreground">
        <p>
          <span className="text-foreground/70">Owner:</span>{" "}
          {agent.owner_name ?? "Unknown"}
        </p>
        {agent.version && (
          <p>
            <span className="text-foreground/70">Version:</span> {agent.version}
          </p>
        )}
        {reviewed && (
          <p>
            <span className="text-foreground/70">Last reviewed:</span> {reviewed}
          </p>
        )}
        {risk && (
          <p>
            <span className="text-foreground/70">Risk:</span>{" "}
            <span className={cn("font-medium", riskColor[agent.risk_level ?? ""])}>
              {risk}
            </span>
          </p>
        )}
      </div>

      {/* Footer actions */}
      <div className="mt-5 flex items-center justify-between gap-2 border-t pt-4">
        <Link
          href={`/agents/${agent.id}`}
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          Open Agent
        </Link>
        <CopyButton
          text={buildInstructions(agent)}
          label="Copy Instructions"
          variant="outline"
          entityType="agent"
          entityId={agent.id}
        />
      </div>
    </div>
  )
}
