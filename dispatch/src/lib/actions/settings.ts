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
