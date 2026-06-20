import { notFound } from "next/navigation"
import { getAgentById } from "@/lib/queries/agents"
import { updateAgent } from "@/lib/actions/agents"
import { getFoundationAssetOptions } from "@/lib/queries/context-assets"
import { PageHeader } from "@/components/shared/page-header"
import { AgentForm } from "@/components/forms/agent-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditAgentPage({ params }: Props) {
  const { id } = await params
  const [agent, foundationAssets] = await Promise.all([
    getAgentById(id),
    getFoundationAssetOptions(),
  ])
  if (!agent) return notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return updateAgent(id, formData)
  }

  return (
    <div>
      <PageHeader title="Edit Agent" />
      <AgentForm
        action={handleUpdate}
        defaultValues={agent}
        availableContextAssets={foundationAssets}
        connectedAssetIds={agent.connected_asset_ids}
      />
    </div>
  )
}
