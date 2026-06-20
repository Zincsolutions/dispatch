"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { updateProfileAvatar, removeProfileAvatar } from "@/lib/actions/settings"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

const MAX_FILE_MB = 5

export function initialsFrom(name: string, email: string) {
  const trimmed = name.trim()
  if (trimmed) {
    return trimmed
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }
  return email[0]?.toUpperCase() ?? "?"
}

function fileExt(f: File) {
  return (f.name.split(".").pop() || "png").toLowerCase()
}

interface AvatarUploadProps {
  userId: string
  avatarUrl: string | null
  name: string
  email: string
}

export function AvatarUpload({ userId, avatarUrl, name, email }: AvatarUploadProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const initials = initialsFrom(name, email)
  const busy = uploading || removing

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    // Reset so selecting the same file again still fires onChange.
    if (inputRef.current) inputRef.current.value = ""
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file")
      return
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast.error(`Images must be under ${MAX_FILE_MB} MB`)
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const path = `${userId}/${crypto.randomUUID()}.${fileExt(file)}`
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { contentType: file.type, upsert: false })
      if (uploadError) {
        toast.error(uploadError.message)
        return
      }
      const result = await updateProfileAvatar(path)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Profile photo updated")
      router.refresh()
    } finally {
      setUploading(false)
    }
  }

  async function handleRemove() {
    setRemoving(true)
    try {
      const result = await removeProfileAvatar()
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success("Profile photo removed")
      router.refresh()
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Avatar className="size-20">
        {avatarUrl && <AvatarImage src={avatarUrl} alt={name || "Profile photo"} />}
        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : avatarUrl ? (
              "Change photo"
            ) : (
              "Upload photo"
            )}
          </Button>
          {avatarUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              onClick={handleRemove}
            >
              {removing ? "Removing..." : "Remove"}
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          JPG, PNG or GIF. Max {MAX_FILE_MB} MB. Shown as a circle.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>
    </div>
  )
}
