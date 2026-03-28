import { createClient } from "@/lib/supabase/server"
import { SignupForm } from "./signup-form"
import { SetupOrgForm } from "./setup-org-form"

export default async function SignupPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Authenticated but no org — show org setup only
  if (user) {
    return <SetupOrgForm userEmail={user.email || ""} />
  }

  // Not authenticated — show full signup
  return <SignupForm />
}
