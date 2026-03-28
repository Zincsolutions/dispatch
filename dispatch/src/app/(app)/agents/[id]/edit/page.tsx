import { notFound } from "next/navigation"
import { getAgentById } from "@/lib/queries/agents"
import { updateAgent } from "@/lib/actions/agents"
import { PageHeader } from "@/components/shared/page-header"
import { AgentForm } from "@/components/forms/agent-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditAgentPage({ params }: Props) {
  const { id } = await params
  const agent = await getAgentById(id)
  if (!agent) return notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return updateAgent(id, formData)
  }

  return (
    <div>
      <PageHeader title="Edit Agent" />
      <AgentForm action={handleUpdate} defaultValues={agent} />
    </div>
  )
}
