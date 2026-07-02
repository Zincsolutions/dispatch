import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/page-header"
import { PromptForm } from "@/components/forms/prompt-form"
import { createPrompt } from "@/lib/actions/prompts"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { getFoundationAssetOptions } from "@/lib/queries/context-assets"

export const metadata: Metadata = { title: "New Prompt" }

export default async function NewPromptPage() {
  const [{ organizationId }, foundationAssets] = await Promise.all([
    getCurrentUserWithOrg(),
    getFoundationAssetOptions(),
  ])

  return (
    <div>
      <PageHeader title="New Prompt" />
      <PromptForm
        action={createPrompt}
        orgId={organizationId}
        availableContextAssets={foundationAssets}
      />
    </div>
  )
}
