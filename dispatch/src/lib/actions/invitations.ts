"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { invitationSchema } from "@/lib/validations/invitations"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createInvitation(formData: FormData) {
  const supabase = await createClient()
  const { user, organizationId, role } = await getCurrentUserWithOrg()

  if (role !== "owner") {
    return { error: "Only owners can invite members" }
  }

  const parsed = invitationSchema.safeParse({
    email: (formData.get("email") as string)?.trim().toLowerCase(),
    role: formData.get("role") || "member",
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" }
  }

  // Already a member with this email?
  const { data: members } = await supabase
    .from("organization_members")
    .select("user_id, profiles(email)")
    .eq("organization_id", organizationId)

  const alreadyMember = (members || []).some(
    (m) =>
      (m.profiles as { email?: string } | null)?.email?.toLowerCase() ===
      parsed.data.email
  )
  if (alreadyMember) {
    return { error: "That person is already a member of your organization" }
  }

  // Already a pending invitation?
  const { data: existing } = await supabase
    .from("invitations")
    .select("id")
    .eq("organization_id", organizationId)
    .eq("email", parsed.data.email)
    .eq("status", "pending")
    .limit(1)

  if (existing && existing.length > 0) {
    return { error: "An invitation for that email is already pending" }
  }

  const { error } = await supabase.from("invitations").insert({
    organization_id: organizationId,
    email: parsed.data.email,
    role: parsed.data.role,
    invited_by: user.id,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/settings")
  return { success: true }
}

export async function revokeInvitation(id: string) {
  const supabase = await createClient()
  const { role } = await getCurrentUserWithOrg()

  if (role !== "owner") {
    return { error: "Only owners can revoke invitations" }
  }

  const { error } = await supabase
    .from("invitations")
    .update({ status: "revoked" })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/settings")
  return { success: true }
}

// Looks up a pending, unexpired invitation by token using the service role
// (the invitee has no org membership, so RLS would hide the row from them).
async function getValidInvitation(token: string) {
  const admin = createAdminClient()
  const { data: invitation } = await admin
    .from("invitations")
    .select("*, organizations(name)")
    .eq("token", token)
    .single()

  if (!invitation) return { error: "This invitation link is not valid." }
  if (invitation.status === "revoked")
    return { error: "This invitation has been revoked." }
  if (invitation.status === "accepted")
    return { error: "This invitation has already been used." }
  if (new Date(invitation.expires_at) < new Date())
    return { error: "This invitation has expired. Ask for a new one." }

  return { invitation }
}

// Joins the current (already authenticated) user to the inviting org.
export async function acceptInvitation(token: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "You need to be signed in to accept an invitation." }
  }

  const result = await getValidInvitation(token)
  if (result.error || !result.invitation) {
    return { error: result.error }
  }
  const invitation = result.invitation

  const admin = createAdminClient()

  // Single-org model: a user can only belong to one organization.
  const { data: existingMembership } = await admin
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id)
    .limit(1)

  if (existingMembership && existingMembership.length > 0) {
    if (existingMembership[0].organization_id === invitation.organization_id) {
      redirect("/dashboard")
    }
    return {
      error:
        "This account already belongs to an organization. Sign up with a different email to join this one.",
    }
  }

  const { error: memberError } = await admin.from("organization_members").insert({
    organization_id: invitation.organization_id,
    user_id: user.id,
    role: invitation.role,
  })

  if (memberError) {
    return { error: "Failed to join organization: " + memberError.message }
  }

  await admin
    .from("invitations")
    .update({ status: "accepted" })
    .eq("id", invitation.id)

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

// Creates a new account from an invite link, then joins the org.
export async function signupForInvite(token: string, formData: FormData) {
  const result = await getValidInvitation(token)
  if (result.error || !result.invitation) {
    return { error: result.error }
  }
  const invitation = result.invitation

  const password = formData.get("password") as string
  const fullName = formData.get("full_name") as string

  const supabase = await createClient()
  const { data: authData, error: authError } = await supabase.auth.signUp({
    // The account is created with the invited email, so the invitation
    // can't be redeemed by an address it wasn't sent to.
    email: invitation.email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (authError) {
    return { error: authError.message }
  }
  if (!authData.user) {
    return { error: "Failed to create account" }
  }

  const admin = createAdminClient()
  const { error: memberError } = await admin.from("organization_members").insert({
    organization_id: invitation.organization_id,
    user_id: authData.user.id,
    role: invitation.role,
  })

  if (memberError) {
    return { error: "Failed to join organization: " + memberError.message }
  }

  await admin
    .from("invitations")
    .update({ status: "accepted" })
    .eq("id", invitation.id)

  revalidatePath("/", "layout")
  redirect("/dashboard")
}
