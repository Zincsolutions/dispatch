import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { getCollections } from "@/lib/queries/library"
import { getFoundationAssetOptions } from "@/lib/queries/context-assets"
import { createLibraryImage } from "@/lib/actions/library"
import { LibraryImageForm } from "@/components/forms/library-image-form"

export default async function NewLibraryImagePage() {
  const [{ organizationId }, collections, foundationAssets] = await Promise.all([
    getCurrentUserWithOrg(),
    getCollections(),
    getFoundationAssetOptions(),
  ])

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Add Image</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Store the image together with the prompt and parameters that created
        it — the recipe next to the result.
      </p>
      <LibraryImageForm
        action={createLibraryImage}
        collections={collections}
        orgId={organizationId}
        availableContextAssets={foundationAssets}
      />
    </div>
  )
}
