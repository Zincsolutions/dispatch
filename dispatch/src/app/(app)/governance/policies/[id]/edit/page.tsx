import { notFound } from "next/navigation"
import { getDocumentById } from "@/lib/queries/governance"
import { updateDocument } from "@/lib/actions/governance"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { DocumentForm } from "@/components/forms/document-form"

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditDocumentPage({ params }: Props) {
  const { id } = await params
  const [document, { organizationId }] = await Promise.all([
    getDocumentById(id),
    getCurrentUserWithOrg(),
  ])
  if (!document) return notFound()

  const action = updateDocument.bind(null, id)

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-6">
        Edit Document
      </h1>
      <DocumentForm
        action={action}
        defaultValues={document}
        orgId={organizationId}
        defaultAttachmentUrl={document.attachment_url}
        defaultAttachmentName={document.attachment_name}
      />
    </div>
  )
}
