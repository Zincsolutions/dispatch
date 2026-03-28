import { PageHeader } from "@/components/shared/page-header"
import { WorkflowForm } from "@/components/forms/workflow-form"
import { createWorkflow } from "@/lib/actions/workflows"
import { getPrompts } from "@/lib/queries/prompts"
import { getContextAssets } from "@/lib/queries/context-assets"
import { getAgents } from "@/lib/queries/agents"

export default async function NewWorkflowPage() {
  const [prompts, contextAssets, agents] = await Promise.all([
    getPrompts(),
    getContextAssets(),
    getAgents(),
  ])

  return (
    <div>
      <PageHeader title="New Workflow" />
      <WorkflowForm
        action={createWorkflow}
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
