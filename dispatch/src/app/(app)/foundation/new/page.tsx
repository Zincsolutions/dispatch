import { PageHeader } from "@/components/shared/page-header"
import { ContextAssetForm } from "@/components/forms/context-asset-form"
import { createContextAsset } from "@/lib/actions/context-assets"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"

export default async function NewContextAssetPage() {
  const { organizationId } = await getCurrentUserWithOrg()
  return (
    <div>
      <PageHeader title="Add Foundation Asset" />
      <ContextAssetForm action={createContextAsset} orgId={organizationId} />
    </div>
  )
}
