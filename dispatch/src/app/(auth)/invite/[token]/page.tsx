import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getInvitationForToken } from "@/lib/queries/invitations"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { AcceptInviteCard } from "./accept-invite-card"
import { InviteSignupForm } from "./invite-signup-form"

interface Props {
  params: Promise<{ token: string }>
}

function InviteMessage({ title, message }: { title: string; message: string }) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Link href="/" className="text-sm text-primary underline-offset-4 hover:underline">
          Go to dispatchvault.com
        </Link>
      </CardContent>
    </Card>
  )
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params
  const invitation = await getInvitationForToken(token)

  if (!invitation) {
    return (
      <InviteMessage
        title="Invitation not found"
        message="This invitation link is not valid. Ask your teammate to send a new one."
      />
    )
  }

  if (invitation.status === "revoked") {
    return (
      <InviteMessage
        title="Invitation revoked"
        message="This invitation has been revoked. Ask your teammate to send a new one."
      />
    )
  }

  if (invitation.status === "accepted") {
    return (
      <InviteMessage
        title="Invitation already used"
        message="This invitation has already been accepted. If that was you, just log in."
      />
    )
  }

  if (new Date(invitation.expiresAt) < new Date()) {
    return (
      <InviteMessage
        title="Invitation expired"
        message="This invitation has expired. Ask your teammate to send a new one."
      />
    )
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    return (
      <AcceptInviteCard
        token={token}
        organizationName={invitation.organizationName}
        userEmail={user.email || ""}
      />
    )
  }

  return (
    <InviteSignupForm
      token={token}
      organizationName={invitation.organizationName}
      email={invitation.email}
    />
  )
}
