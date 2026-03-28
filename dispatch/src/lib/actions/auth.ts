"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("full_name") as string
  const orgName = formData.get("org_name") as string

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
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

  const result = await createOrgAndMembership(authData.user.id, orgName)
  if (result?.error) {
    return result
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function setupOrganization(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const orgName = formData.get("org_name") as string
  if (!orgName?.trim()) {
    return { error: "Organization name is required" }
  }

  const { data: existing } = await supabase
    .from("organization_members")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (existing) {
    redirect("/dashboard")
  }

  const result = await createOrgAndMembership(user.id, orgName.trim())
  if (result?.error) {
    return result
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

async function createOrgAndMembership(userId: string, orgName: string) {
  // Use the service role client to bypass RLS for this bootstrap operation.
  // The anon client can't SELECT from organizations before membership exists
  // (the SELECT policy depends on get_user_org_id() which reads organization_members).
  const admin = createAdminClient()

  const slug = orgName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  // Check if an orphaned org with this slug exists (from a previous partial attempt)
  const { data: existingOrg } = await admin
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .single()

  let orgId: string

  if (existingOrg) {
    // Reuse the orphaned org
    orgId = existingOrg.id
  } else {
    // Create new org
    const { data: newOrg, error: orgError } = await admin
      .from("organizations")
      .insert({ name: orgName, slug })
      .select("id")
      .single()

    if (orgError || !newOrg) {
      return { error: "Failed to create organization: " + (orgError?.message || "unknown error") }
    }

    orgId = newOrg.id
  }

  // Create the membership (skip if it already exists from a partial attempt)
  const { data: existingMember } = await admin
    .from("organization_members")
    .select("id")
    .eq("organization_id", orgId)
    .eq("user_id", userId)
    .single()

  if (!existingMember) {
    const { error: memberError } = await admin
      .from("organization_members")
      .insert({
        organization_id: orgId,
        user_id: userId,
        role: "owner",
      })

    if (memberError) {
      return { error: "Failed to set up organization membership: " + memberError.message }
    }
  }

  return null
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
