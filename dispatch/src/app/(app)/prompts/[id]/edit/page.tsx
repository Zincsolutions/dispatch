import { notFound } from "next/navigation"
import { getPromptById } from "@/lib/queries/prompts"
import { updatePrompt } from "@/lib/actions/prompts"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { PageHeader } from "@/components/shared/page-header"
import { PromptForm } from "@/components/forms/prompt-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditPromptPage({ params }: Props) {
  const { id } = await params
  const [prompt, { organizationId }] = await Promise.all([
    getPromptById(id),
    getCurrentUserWithOrg(),
  ])
  if (!prompt) return notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return updatePrompt(id, formData)
  }

  return (
    <div>
      <PageHeader title="Edit Prompt" />
      <PromptForm
        action={handleUpdate}
        defaultValues={prompt}
        orgId={organizationId}
        defaultSampleOutputUrl={prompt.sample_output_url}
      />
    </div>
  )
}
