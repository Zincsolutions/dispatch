import { notFound } from "next/navigation"
import { getLibraryImageById, getCollections } from "@/lib/queries/library"
import { updateLibraryImage } from "@/lib/actions/library"
import { LibraryImageForm } from "@/components/forms/library-image-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditLibraryImagePage({ params }: Props) {
  const { id } = await params
  const [image, collections] = await Promise.all([
    getLibraryImageById(id),
    getCollections(),
  ])
  if (!image) return notFound()

  const action = updateLibraryImage.bind(null, id)

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Edit Image</h1>
      <LibraryImageForm
        action={action}
        collections={collections}
        defaultValues={image}
      />
    </div>
  )
}
