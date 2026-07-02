import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getWorkflowById } from "@/lib/queries/workflows"
import { deleteWorkflow } from "@/lib/actions/workflows"
import { StatusBadge } from "@/components/shared/status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { CopyButton } from "@/components/shared/copy-button"
import { DEPARTMENTS, RISK_LEVELS } from "@/lib/constants"
import { buildLoopPrompt } from "@/lib/workflow-loop"
import { Pencil, Trash2, ArrowLeft, Repeat } from "lucide-react"
import type { WorkflowStep } from "@/lib/types"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("workflows")
    .select("title")
    .eq("id", id)
    .maybeSingle()
  return { title: data?.title ?? "Not found" }
}

export default async function WorkflowDetailPage({ params }: Props) {
  const { id } = await params
  const workflow = await getWorkflowById(id)
  if (!workflow) return notFound()

  const steps = (workflow.steps as WorkflowStep[]) || []
  const isLoop = workflow.type === "loop"
  const departmentLabel =
    DEPARTMENTS.find((d) => d.value === workflow.department)?.label ??
    workflow.department
  const riskLabel = RISK_LEVELS.find((r) => r.value === workflow.risk_level)?.label
  const subtitle = [departmentLabel, workflow.category].filter(Boolean).join(" • ")
  const lastReviewed = workflow.last_reviewed
    ? new Date(`${workflow.last_reviewed}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null
  const copyText = buildLoopPrompt(workflow, {
    agentName: workflow.linked_agents[0]?.name,
    contextNames: workflow.linked_context_assets.map((c) => c.title),
    promptNames: workflow.linked_prompts.map((p) => p.title),
  })

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <Link
          href="/workflows"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Workflows
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {workflow.title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            )}
            {workflow.description && (
              <p className="text-muted-foreground mt-1">
                {workflow.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <CopyButton
              text={copyText}
              label={isLoop ? "Copy Loop" : "Copy"}
              variant="outline"
              entityType="workflow"
              entityId={id}
            />
            <Link href={`/workflows/${id}/edit`} className={buttonVariants({ variant: "outline", size: "sm" })}>
              <Pencil className="mr-1 h-4 w-4" />
              Edit
            </Link>
            <ConfirmDialog
              title="Delete workflow"
              description="Are you sure you want to delete this workflow? This action cannot be undone."
              onConfirm={async () => {
                "use server"
                await deleteWorkflow(id)
              }}
              trigger={
                <Button variant="outline" size="sm">
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Badge
          variant="secondary"
          className={
            isLoop
              ? "bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200"
              : "bg-muted text-muted-foreground"
          }
        >
          {isLoop && <Repeat className="mr-1 h-3 w-3" />}
          <span className="capitalize">{workflow.type}</span>
        </Badge>
        <StatusBadge status={workflow.status} />
      </div>

      {(workflow.version ||
        riskLabel ||
        workflow.estimated_run_time ||
        workflow.output_format) && (
        <div className="rounded-lg border p-4 mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Overview
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Owner</p>
              <p>{workflow.created_by_name}</p>
            </div>
            {workflow.version && (
              <div>
                <p className="text-xs text-muted-foreground">Version</p>
                <p>{workflow.version}</p>
              </div>
            )}
            {riskLabel && (
              <div>
                <p className="text-xs text-muted-foreground">Risk</p>
                <p>{riskLabel}</p>
              </div>
            )}
            {lastReviewed && (
              <div>
                <p className="text-xs text-muted-foreground">Last reviewed</p>
                <p>{lastReviewed}</p>
              </div>
            )}
            {workflow.estimated_run_time && (
              <div>
                <p className="text-xs text-muted-foreground">Est. run time</p>
                <p>{workflow.estimated_run_time}</p>
              </div>
            )}
            {workflow.output_format && (
              <div>
                <p className="text-xs text-muted-foreground">Output format</p>
                <p>{workflow.output_format}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isLoop &&
        (workflow.success_criteria ||
          workflow.verification_method ||
          workflow.stop_condition ||
          workflow.escalation_condition) && (
          <div className="rounded-lg border p-4 mb-6 space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              Success / Stop
            </h2>
            {workflow.success_criteria && (
              <div>
                <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Success criteria
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {workflow.success_criteria}
                </p>
              </div>
            )}
            {workflow.verification_method && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Verification method
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {workflow.verification_method}
                </p>
              </div>
            )}
            {workflow.stop_condition && (
              <div>
                <p className="text-xs font-medium text-orange-700 dark:text-orange-400">
                  Stop condition
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {workflow.stop_condition}
                </p>
              </div>
            )}
            {workflow.escalation_condition && (
              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  Escalation condition
                </p>
                <p className="text-sm whitespace-pre-wrap">
                  {workflow.escalation_condition}
                </p>
              </div>
            )}
          </div>
        )}

      {steps.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            Steps
          </h2>
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.order} className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">
                    Step {step.order}
                  </span>
                  <span className="font-medium text-sm">{step.title}</span>
                </div>
                {step.description && (
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {workflow.tags.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Tags
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {workflow.tags.map((tag) => (
              <Link key={tag} href={`/workflows?tag=${encodeURIComponent(tag)}`}>
                <Badge
                  variant="secondary"
                  className="hover:bg-secondary/80 cursor-pointer"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {workflow.linked_prompts.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Linked Prompts
          </h2>
          <div className="space-y-1">
            {workflow.linked_prompts.map((p) => (
              <Link
                key={p.id}
                href={`/prompts/${p.id}`}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <span>{p.title}</span>
                <StatusBadge status={p.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {workflow.linked_context_assets.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Connected Foundation Assets
          </h2>
          <div className="space-y-1">
            {workflow.linked_context_assets.map((ca) => (
              <Link
                key={ca.id}
                href={`/foundation/${ca.id}`}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <span>{ca.title}</span>
                <StatusBadge status={ca.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {workflow.linked_agents.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">
            Linked Agents
          </h2>
          <div className="space-y-1">
            {workflow.linked_agents.map((a) => (
              <Link
                key={a.id}
                href={`/agents/${a.id}`}
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent transition-colors"
              >
                <span>{a.name}</span>
                <StatusBadge status={a.status} />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-1">
        <p>Created by {workflow.created_by_name}</p>
        <p>
          Created {new Date(workflow.created_at).toLocaleDateString()} &middot;
          Updated {new Date(workflow.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}
