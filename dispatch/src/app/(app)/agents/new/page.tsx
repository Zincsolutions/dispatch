import { PageHeader } from "@/components/shared/page-header"
import { AgentForm } from "@/components/forms/agent-form"
import { createAgent } from "@/lib/actions/agents"

export default function NewAgentPage() {
  return (
    <div>
      <PageHeader title="New Agent" />
      <AgentForm action={createAgent} />
    </div>
  )
}
