import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { WorkflowForm } from "@/components/forms/workflow-form"
import { createWorkflow } from "@/lib/actions/workflows"
import { getPrompts } from "@/lib/queries/prompts"
import { getContextAssets } from "@/lib/queries/context-assets"
import { getAgents } from "@/lib/queries/agents"

interface Props {
  searchParams: Promise<{ type?: string }>
}

export const metadata: Metadata = { title: "New Workflow" }

export default async function NewWorkflowPage({ searchParams }: Props) {
  const { type } = await searchParams
  const [prompts, contextAssets, agents] = await Promise.all([
    getPrompts(),
    getContextAssets(),
    getAgents(),
  ])

  const isLoop = type === "loop"

  return (
    <div>
      <PageHeader title={isLoop ? "New Loop" : "New Workflow"} />
      <WorkflowForm
        action={createWorkflow}
        defaultType={isLoop ? "loop" : "workflow"}
        availablePrompts={prompts.map((p) => ({
          id: p.id,
          title: p.title,
          status: p.status,
        }))}
        availableContextAssets={contextAssets.map((ca) => ({
          id: ca.id,
          title: ca.title,
          status: ca.status,
        }))}
        availableAgents={agents.map((a) => ({
          id: a.id,
          name: a.name,
          status: a.status,
        }))}
      />
    </div>
  )
}
