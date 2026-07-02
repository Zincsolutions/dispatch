"use client"

import { useState } from "react"
import { createInvitation, revokeInvitation } from "@/lib/actions/invitations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CopyButton } from "@/components/shared/copy-button"
import { toast } from "sonner"
import type { Invitation } from "@/lib/types"

const ROLES = [
  { value: "member", label: "Member" },
  { value: "owner", label: "Owner" },
]

interface InviteMembersProps {
  invitations: Invitation[]
}

export function InviteMembers({ invitations }: InviteMembersProps) {
  const [role, setRole] = useState("member")
  const [loading, setLoading] = useState(false)
  const [revoking, setRevoking] = useState<string | null>(null)

  async function handleInvite(formData: FormData) {
    setLoading(true)
    formData.set("role", role)
    const result = await createInvitation(formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Invitation created — copy the link and send it to them")
    }
    setLoading(false)
  }

  async function handleRevoke(id: string) {
    setRevoking(id)
    const result = await revokeInvitation(id)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Invitation revoked")
    }
    setRevoking(null)
  }

  function inviteUrl(token: string) {
    return `${window.location.origin}/invite/${token}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Members</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={handleInvite} className="flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="space-y-2 flex-1">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              name="email"
              type="email"
              placeholder="teammate@company.com"
              required
            />
          </div>
          <div className="space-y-2 w-full sm:w-36">
            <Label htmlFor="invite-role">Role</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v ?? "member")}
              items={ROLES}
            >
              <SelectTrigger id="invite-role">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Inviting..." : "Invite"}
          </Button>
        </form>

        {invitations.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              Pending invitations
            </p>
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{invitation.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Invited {new Date(invitation.created_at).toLocaleDateString()} &middot;
                    expires {new Date(invitation.expires_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="capitalize">
                    {invitation.role}
                  </Badge>
                  <CopyButton
                    text={
                      typeof window !== "undefined"
                        ? inviteUrl(invitation.token)
                        : `/invite/${invitation.token}`
                    }
                    label="Copy link"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevoke(invitation.id)}
                    disabled={revoking === invitation.id}
                  >
                    {revoking === invitation.id ? "Revoking..." : "Revoke"}
                  </Button>
                </div>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Send the invite link to your teammate — they&apos;ll create an
              account with the invited email and land in your workspace.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
