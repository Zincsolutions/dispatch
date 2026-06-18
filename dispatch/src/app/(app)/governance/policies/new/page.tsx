import { createDocument } from "@/lib/actions/governance"
import { DocumentForm } from "@/components/forms/document-form"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"

export default async function NewDocumentPage() {
  const { organizationId } = await getCurrentUserWithOrg()

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">New Document</h1>
      <p className="text-sm text-muted-foreground mb-6">
        A policy, SOP, or guideline your team can read and acknowledge.
      </p>
      <DocumentForm action={createDocument} orgId={organizationId} />
    </div>
  )
}
