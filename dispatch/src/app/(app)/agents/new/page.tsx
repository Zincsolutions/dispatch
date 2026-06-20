import { PageHeader } from "@/components/shared/page-header"
import { AgentForm } from "@/components/forms/agent-form"
import { createAgent } from "@/lib/actions/agents"
import { getFoundationAssetOptions } from "@/lib/queries/context-assets"

export default async function NewAgentPage() {
  const foundationAssets = await getFoundationAssetOptions()
  return (
    <div>
      <PageHeader title="New Agent" />
      <AgentForm action={createAgent} availableContextAssets={foundationAssets} />
    </div>
  )
}
