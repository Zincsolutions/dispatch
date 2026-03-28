"use client"

import { useState } from "react"
import { updateOrganization, updateProfile } from "@/lib/actions/settings"
import { signout } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import type { Organization, Profile } from "@/lib/types"

interface SettingsFormProps {
  organization: Organization
  profile: Profile
  members: Array<{
    id: string
    role: string
    profiles: Profile | null
  }>
  role: string
  userEmail: string
}

export function SettingsForm({
  organization,
  profile,
  members,
  role,
  userEmail,
}: SettingsFormProps) {
  const [orgLoading, setOrgLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)

  async function handleOrgUpdate(formData: FormData) {
    setOrgLoading(true)
    const result = await updateOrganization(formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Organization updated")
    }
    setOrgLoading(false)
  }

  async function handleProfileUpdate(formData: FormData) {
    setProfileLoading(true)
    const result = await updateProfile(formData)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Profile updated")
    }
    setProfileLoading(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleOrgUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                name="name"
                defaultValue={organization.name}
                disabled={role !== "owner"}
              />
            </div>
            {role === "owner" && (
              <Button type="submit" disabled={orgLoading}>
                {orgLoading ? "Saving..." : "Save"}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleProfileUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                name="full_name"
                defaultValue={profile.full_name}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={userEmail} disabled />
            </div>
            <Button type="submit" disabled={profileLoading}>
              {profileLoading ? "Saving..." : "Save"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">
                    {member.profiles?.full_name || "Unknown"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.profiles?.email}
                  </p>
                </div>
                <Badge variant="outline" className="capitalize">
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Separator />

      <Button variant="outline" onClick={() => signout()}>
        Sign out
      </Button>
    </div>
  )
}
