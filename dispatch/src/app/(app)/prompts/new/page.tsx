import { PageHeader } from "@/components/shared/page-header"
import { PromptForm } from "@/components/forms/prompt-form"
import { createPrompt } from "@/lib/actions/prompts"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"

export default async function NewPromptPage() {
  const { organizationId } = await getCurrentUserWithOrg()

  return (
    <div>
      <PageHeader title="New Prompt" />
      <PromptForm action={createPrompt} orgId={organizationId} />
    </div>
  )
}
