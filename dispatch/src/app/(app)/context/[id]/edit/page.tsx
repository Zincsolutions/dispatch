import { notFound } from "next/navigation"
import { getContextAssetById } from "@/lib/queries/context-assets"
import { updateContextAsset } from "@/lib/actions/context-assets"
import { PageHeader } from "@/components/shared/page-header"
import { ContextAssetForm } from "@/components/forms/context-asset-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditContextAssetPage({ params }: Props) {
  const { id } = await params
  const contextAsset = await getContextAssetById(id)
  if (!contextAsset) return notFound()

  async function handleUpdate(formData: FormData) {
    "use server"
    return updateContextAsset(id, formData)
  }

  return (
    <div>
      <PageHeader title="Edit Context Asset" />
      <ContextAssetForm action={handleUpdate} defaultValues={contextAsset} />
    </div>
  )
}
