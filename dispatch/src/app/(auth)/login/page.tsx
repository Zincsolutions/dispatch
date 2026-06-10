import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your Dispatch workspace.",
}

export default async function LoginPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return <LoginForm />
}
