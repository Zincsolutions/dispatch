import { notFound } from "next/navigation"
import { getWorkflowById } from "@/lib/queries/workflows"
import { updateWorkflow } from "@/lib/actions/workflows"
import { getPrompts } from "@/lib/queries/prompts"
import { getContextAssets } from "@/lib/queries/context-assets"
import { getAgents } from "@/lib/queries/agents"
import { PageHeader } from "@/components/shared/page-header"
import { WorkflowForm } from "@/components/forms/workflow-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditWorkflowPage({ params }: Props) {
  const { id } = await params
  const workflow = await getWorkflowById(id)
  if (!workflow) return notFound()

  const [prompts, contextAssets, agents] = await Promise.all([
    getPrompts(),
    getContextAssets(),
    getAgents(),
  ])

  async function handleUpdate(formData: FormData) {
    "use server"
    return updateWorkflow(id, formData)
  }

  return (
    <div>
      <PageHeader title="Edit Workflow" />
      <WorkflowForm
        action={handleUpdate}
        defaultValues={{
          ...workflow,
          workflow_prompts: workflow.linked_prompts.map((p) => ({ prompt_id: p.id })),
          workflow_context_assets: workflow.linked_context_assets.map((ca) => ({ context_asset_id: ca.id })),
          workflow_agents: workflow.linked_agents.map((a) => ({ agent_id: a.id })),
        }}
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
