"use server"

import { createClient } from "@/lib/supabase/server"
import { getCurrentUserWithOrg } from "@/lib/queries/organization"
import { revalidatePath } from "next/cache"

export async function updateOrganization(formData: FormData) {
  const supabase = await createClient()
  const { organizationId, role } = await getCurrentUserWithOrg()

  if (role !== "owner") {
    return { error: "Only owners can update organization settings" }
  }

  const name = formData.get("name") as string
  if (!name?.trim()) {
    return { error: "Organization name is required" }
  }

  const { error } = await supabase
    .from("organizations")
    .update({ name: name.trim() })
    .eq("id", organizationId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/settings")
  revalidatePath("/", "layout")
  return { success: true }
}

const AVATARS_BUCKET = "avatars"

// The file is uploaded directly from the browser to the public avatars
// bucket (RLS-scoped to the user's own folder); this records the URL and
// cleans up any previous avatar so each user keeps a single file.
export async function updateProfileAvatar(storagePath: string) {
  const supabase = await createClient()
  const { user } = await getCurrentUserWithOrg()

  // Never trust the client path: it must live under the user's own folder.
  if (!storagePath || !storagePath.startsWith(`${user.id}/`)) {
    return { error: "Invalid avatar path" }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATARS_BUCKET).getPublicUrl(storagePath)

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  // Best-effort: remove any older files in the user's folder so we don't
  // accumulate orphans (an orphaned file is preferable to a failed save).
  const { data: existing } = await supabase.storage
    .from(AVATARS_BUCKET)
    .list(user.id)
  const newFile = storagePath.slice(`${user.id}/`.length)
  const stale = (existing || [])
    .filter((f) => f.name !== newFile)
    .map((f) => `${user.id}/${f.name}`)
  if (stale.length > 0) {
    await supabase.storage.from(AVATARS_BUCKET).remove(stale)
  }

  revalidatePath("/settings")
  revalidatePath("/", "layout")
  return { success: true }
}

export async function removeProfileAvatar() {
  const supabase = await createClient()
  const { user } = await getCurrentUserWithOrg()

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  // Best-effort cleanup of every file in the user's avatar folder.
  const { data: existing } = await supabase.storage
    .from(AVATARS_BUCKET)
    .list(user.id)
  const paths = (existing || []).map((f) => `${user.id}/${f.name}`)
  if (paths.length > 0) {
    await supabase.storage.from(AVATARS_BUCKET).remove(paths)
  }

  revalidatePath("/settings")
  revalidatePath("/", "layout")
  return { success: true }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { user } = await getCurrentUserWithOrg()

  const fullName = formData.get("full_name") as string
  if (!fullName?.trim()) {
    return { error: "Name is required" }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: fullName.trim() })
    .eq("id", user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/settings")
  revalidatePath("/", "layout")
  return { success: true }
}

export async function changePassword(formData: FormData) {
  const supabase = await createClient()
  const { user } = await getCurrentUserWithOrg()

  const current = formData.get("current_password") as string
  const next = formData.get("new_password") as string
  const confirm = formData.get("confirm_password") as string

  if (!current || !next || !confirm) {
    return { error: "All fields are required" }
  }
  if (next !== confirm) {
    return { error: "New passwords do not match" }
  }
  if (next.length < 8) {
    return { error: "New password must be at least 8 characters" }
  }
  if (next === current) {
    return { error: "New password must be different from your current password" }
  }
  if (!user.email) {
    return { error: "Your account has no email login" }
  }

  // Supabase has no dedicated "verify password" endpoint; re-authenticating
  // is the supported way to confirm the current password before changing it.
  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: current,
  })
  if (verifyError) {
    return { error: "Current password is incorrect" }
  }

  const { error } = await supabase.auth.updateUser({ password: next })
  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
