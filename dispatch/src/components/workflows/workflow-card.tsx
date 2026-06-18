import Link from "next/link"
import { Repeat, Workflow as WorkflowIcon } from "lucide-react"
import { StatusBadge } from "@/components/shared/status-badge"
import { CopyButton } from "@/components/shared/copy-button"
import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button-variants"
import { DEPARTMENTS } from "@/lib/constants"
import { buildLoopPrompt } from "@/lib/workflow-loop"
import type { WorkflowWithMeta } from "@/lib/queries/workflows"

const departmentLabel = (v: string | null) =>
  DEPARTMENTS.find((d) => d.value === v)?.label ?? v ?? null

function formatReviewed(date: string | null) {
  if (!date) return null
  const d = new Date(`${date}T00:00:00`)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function TypePill({ type }: { type: string }) {
  const isLoop = type === "loop"
  return (
    <Badge
      variant="secondary"
      className={
        isLoop
          ? "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200"
          : "bg-muted text-muted-foreground"
      }
    >
      {isLoop ? (
        <Repeat className="mr-1 h-3 w-3" />
      ) : (
        <WorkflowIcon className="mr-1 h-3 w-3" />
      )}
      <span className="capitalize">{type}</span>
    </Badge>
  )
}

export function WorkflowCard({ workflow }: { workflow: WorkflowWithMeta }) {
  const isLoop = workflow.type === "loop"
  const subtitle = [departmentLabel(workflow.department), workflow.category]
    .filter(Boolean)
    .join(" • ")
  const reviewed = formatReviewed(workflow.last_reviewed)

  return (
    <div className="flex flex-col rounded-xl border bg-card p-5 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <TypePill type={workflow.type} />
        <StatusBadge status={workflow.status} />
      </div>

      <div className="mt-3">
        <h3 className="font-semibold leading-tight">{workflow.title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>

      {workflow.description && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {workflow.description}
        </p>
      )}

      {/* Metadata */}
      <div className="mt-4 space-y-1 text-xs text-muted-foreground">
        {workflow.agent_name && (
          <p>
            <span className="text-foreground/70">Agent:</span> {workflow.agent_name}
          </p>
        )}
        <p>
          <span className="text-foreground/70">Context:</span>{" "}
          {workflow.context_count} assets{"   "}
          <span className="text-foreground/70">Prompts:</span>{" "}
          {workflow.prompt_count}
        </p>
        <p>
          <span className="text-foreground/70">Owner:</span>{" "}
          {workflow.owner_name ?? "Unknown"}
        </p>
        {reviewed && (
          <p>
            <span className="text-foreground/70">Last reviewed:</span> {reviewed}
          </p>
        )}
      </div>

      {/* Loop success / stop */}
      {isLoop && (workflow.success_criteria || workflow.stop_condition) && (
        <div className="mt-4 space-y-1 text-xs">
          {workflow.success_criteria && (
            <p className="line-clamp-2">
              <span className="font-medium text-emerald-700 dark:text-emerald-400">
                Success:
              </span>{" "}
              <span className="text-muted-foreground">
                {workflow.success_criteria}
              </span>
            </p>
          )}
          {workflow.stop_condition && (
            <p className="line-clamp-2">
              <span className="font-medium text-orange-700 dark:text-orange-400">
                Stop:
              </span>{" "}
              <span className="text-muted-foreground">
                {workflow.stop_condition}
              </span>
            </p>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-5 flex items-center justify-between gap-2 border-t pt-4">
        <Link
          href={`/workflows/${workflow.id}`}
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          Open
        </Link>
        <CopyButton
          text={buildLoopPrompt(workflow, { agentName: workflow.agent_name })}
          label={isLoop ? "Copy Loop" : "Copy"}
          variant="outline"
          entityType="workflow"
          entityId={workflow.id}
        />
      </div>
    </div>
  )
}
