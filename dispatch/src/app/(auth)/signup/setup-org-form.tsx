"use client"

import { useState } from "react"
import { setupOrganization, signout } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface SetupOrgFormProps {
  userEmail: string
}

export function SetupOrgForm({ userEmail }: SetupOrgFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setError(null)
    setLoading(true)
    const result = await setupOrganization(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Set up your Vault</CardTitle>
        <CardDescription>
          Signed in as {userEmail}. Create your organization to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="org_name">Organization Name</Label>
            <Input
              id="org_name"
              name="org_name"
              placeholder="Acme Inc."
              required
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating organization..." : "Create organization"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Wrong account?{" "}
          <button
            type="button"
            onClick={() => signout()}
            className="text-primary underline-offset-4 hover:underline"
          >
            Sign out
          </button>
        </p>
      </CardFooter>
    </Card>
  )
}
