"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { logUsage } from "@/lib/actions/usage"
import { extractVariables, fillVariables } from "@/lib/prompt-variables"

type RunTarget = "chatgpt" | "claude"

const TARGETS: Record<
  RunTarget,
  { label: string; buildUrl: (text: string) => string; action: "run_chatgpt" | "run_claude" }
> = {
  chatgpt: {
    label: "Run in ChatGPT",
    buildUrl: (text) => `https://chatgpt.com/?q=${encodeURIComponent(text)}`,
    action: "run_chatgpt",
  },
  claude: {
    label: "Run in Claude",
    buildUrl: (text) => `https://claude.ai/new?q=${encodeURIComponent(text)}`,
    action: "run_claude",
  },
}

interface RunPromptProps {
  promptId: string
  body: string
}

export function RunPrompt({ promptId, body }: RunPromptProps) {
  const variables = useMemo(() => extractVariables(body), [body])
  const [open, setOpen] = useState(false)
  const [pendingTarget, setPendingTarget] = useState<RunTarget>("chatgpt")
  const [values, setValues] = useState<Record<string, string>>({})

  function launch(target: RunTarget, text: string) {
    const { buildUrl, action } = TARGETS[target]
    // Also place the prompt on the clipboard — very long prompts can be
    // truncated by the URL handoff, so the user always has a fallback.
    void navigator.clipboard.writeText(text).catch(() => {})
    window.open(buildUrl(text), "_blank", "noopener,noreferrer")
    toast.success("Prompt copied & opened — paste it if the chat box is empty")
    void logUsage("prompt", promptId, action)
  }

  function handleRunClick(target: RunTarget) {
    if (variables.length === 0) {
      launch(target, body)
      return
    }
    setPendingTarget(target)
    setOpen(true)
  }

  function handleDialogRun() {
    launch(pendingTarget, fillVariables(body, values))
    setOpen(false)
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => handleRunClick("chatgpt")}>
        <ExternalLink className="mr-1 h-4 w-4" />
        Run in ChatGPT
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleRunClick("claude")}>
        <ExternalLink className="mr-1 h-4 w-4" />
        Run in Claude
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fill in the variables</DialogTitle>
            <DialogDescription>
              This prompt has {variables.length}{" "}
              {variables.length === 1 ? "variable" : "variables"}. Fill them in
              and run it in {TARGETS[pendingTarget].label.replace("Run in ", "")}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {variables.map((name) => (
              <div key={name} className="space-y-1.5">
                <Label htmlFor={`var-${name}`}>{name}</Label>
                <Input
                  id={`var-${name}`}
                  value={values[name] || ""}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [name]: e.target.value }))
                  }
                  placeholder={`{{${name}}}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleDialogRun}>
              <ExternalLink className="mr-1 h-4 w-4" />
              {TARGETS[pendingTarget].label}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
