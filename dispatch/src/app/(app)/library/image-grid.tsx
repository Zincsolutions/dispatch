"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import { Square, LayoutGrid } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { LibraryImageWithUrl } from "@/lib/queries/library"

type Size = "large" | "small"
const STORAGE_KEY = "library:image-size"
const CHANGE_EVENT = "library:image-size-change"

function readSize(): Size {
  return localStorage.getItem(STORAGE_KEY) === "small" ? "small" : "large"
}

// Read the persisted size preference via an external store so the toggle is
// hydration-safe (server renders "large", then syncs to the saved value) and
// stays in sync across tabs.
function useImageSize(): [Size, (next: Size) => void] {
  const size = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("storage", onChange)
      window.addEventListener(CHANGE_EVENT, onChange)
      return () => {
        window.removeEventListener("storage", onChange)
        window.removeEventListener(CHANGE_EVENT, onChange)
      }
    },
    readSize,
    () => "large"
  )

  function setSize(next: Size) {
    localStorage.setItem(STORAGE_KEY, next)
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }

  return [size, setSize]
}

export function ImageGrid({ images }: { images: LibraryImageWithUrl[] }) {
  const [size, setSize] = useImageSize()
  const isSmall = size === "small"

  return (
    <div>
      <div className="flex items-center justify-end mb-3">
        <div className="inline-flex items-center rounded-md border p-0.5">
          <button
            type="button"
            onClick={() => setSize("large")}
            aria-label="Large images"
            aria-pressed={!isSmall}
            className={cn(
              "flex items-center justify-center rounded-sm p-1.5 transition-colors",
              !isSmall
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Square className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setSize("small")}
            aria-label="Small images"
            aria-pressed={isSmall}
            className={cn(
              "flex items-center justify-center rounded-sm p-1.5 transition-colors",
              isSmall
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-4",
          isSmall
            ? "grid-cols-4 sm:grid-cols-6 lg:grid-cols-8"
            : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
        )}
      >
        {images.map((image) => (
          <Link
            key={image.id}
            href={`/library/${image.id}`}
            className="group rounded-lg border overflow-hidden hover:shadow-md transition-shadow bg-card"
          >
            <div className="aspect-square bg-muted overflow-hidden">
              {image.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image.url}
                  alt={image.title || image.prompt.slice(0, 80) || "Library image"}
                  className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">
                  Preview unavailable
                </div>
              )}
            </div>
            {isSmall ? (
              <div className="p-2">
                <p className="text-xs font-medium truncate">
                  {image.title || image.prompt || "Untitled"}
                </p>
              </div>
            ) : (
              <div className="p-3">
                <p className="text-sm font-medium truncate">
                  {image.title || image.prompt || "Untitled"}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  {image.sref && (
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      sref {image.sref.length > 12 ? `${image.sref.slice(0, 12)}…` : image.sref}
                    </Badge>
                  )}
                  <span className="text-[11px] text-muted-foreground capitalize ml-auto">
                    {image.tool}
                  </span>
                </div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
