import { PageHeader } from "@/components/shared/page-header"
import { PromptForm } from "@/components/forms/prompt-form"
import { createPrompt } from "@/lib/actions/prompts"

export default function NewPromptPage() {
  return (
    <div>
      <PageHeader title="New Prompt" />
      <PromptForm action={createPrompt} />
    </div>
  )
}
