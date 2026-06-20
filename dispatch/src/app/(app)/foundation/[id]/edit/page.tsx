import { notFound } from "next/navigation"
import { getContextAssetById } from "@/lib/queries/context-assets"
import { updateContextAsset } from "@/lib/actions/context-assets"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { PageHeader } from "@/components/shared/page-header"
import { ContextAssetForm } from "@/components/forms/context-asset-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditContextAssetPage({ params }: Props) {
  const { id } = await params
  const [contextAsset, { organizationId }] = await Promise.all([
    getContextAssetById(id),
    getCurrentUserWithOrg(),
  ])
  if (!contextAsset) return notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return updateContextAsset(id, formData)
  }

  return (
    <div>
      <PageHeader title="Edit Foundation Asset" />
      <ContextAssetForm
        action={handleUpdate}
        orgId={organizationId}
        defaultValues={contextAsset}
        existingFiles={contextAsset.files.map((f) => ({ id: f.id, file_name: f.file_name }))}
        existingLinks={contextAsset.links.map((l) => ({ url: l.url, label: l.label }))}
      />
    </div>
  )
}
