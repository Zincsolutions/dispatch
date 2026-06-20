import { notFound } from "next/navigation"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { getLibraryImageById, getCollections } from "@/lib/queries/library"
import { getFoundationAssetOptions } from "@/lib/queries/context-assets"
import { updateLibraryImage } from "@/lib/actions/library"
import { LibraryImageForm } from "@/components/forms/library-image-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditLibraryImagePage({ params }: Props) {
  const { id } = await params
  const [image, collections, { organizationId }, foundationAssets] = await Promise.all([
    getLibraryImageById(id),
    getCollections(),
    getCurrentUserWithOrg(),
    getFoundationAssetOptions(),
  ])
  if (!image) return notFound()

  const action = updateLibraryImage.bind(null, id)

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Edit Image</h1>
      <LibraryImageForm
        action={action}
        collections={collections}
        orgId={organizationId}
        defaultValues={image}
        defaultReferenceUrl={image.reference_url}
        availableContextAssets={foundationAssets}
        connectedAssetIds={image.connected_asset_ids}
      />
    </div>
  )
}
