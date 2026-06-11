import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { getCollections } from "@/lib/queries/library"
import { createLibraryImage } from "@/lib/actions/library"
import { LibraryImageForm } from "@/components/forms/library-image-form"

export default async function NewLibraryImagePage() {
  const { organizationId } = await getCurrentUserWithOrg()
  const collections = await getCollections()

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
      />
    </div>
  )
}
