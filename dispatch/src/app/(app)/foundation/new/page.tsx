import { PageHeader } from "@/components/shared/page-header"
import { ContextAssetForm } from "@/components/forms/context-asset-form"
import { createContextAsset } from "@/lib/actions/context-assets"

export default function NewContextAssetPage() {
  return (
    <div>
      <PageHeader title="Add Foundation Asset" />
      <ContextAssetForm action={createContextAsset} />
    </div>
  )
}
