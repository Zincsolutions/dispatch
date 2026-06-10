"use client"

import { useState } from "react"
import { acceptInvitation } from "@/lib/actions/invitations"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  token: string
  organizationName: string
  userEmail: string
}

export function AcceptInviteCard({ token, organizationName, userEmail }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleAccept() {
    setError(null)
    setLoading(true)
    const result = await acceptInvitation(token)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Join {organizationName}
        </CardTitle>
        <CardDescription>
          You&apos;ve been invited to join {organizationName} on Dispatch.
          You&apos;re signed in as {userEmail}.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button className="w-full" onClick={handleAccept} disabled={loading}>
          {loading ? "Joining..." : `Join ${organizationName}`}
        </Button>
      </CardContent>
    </Card>
  )
}
