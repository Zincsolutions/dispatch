import type { Workflow, WorkflowStep } from "@/lib/types"

interface LoopPromptExtras {
  agentName?: string | null
  contextNames?: string[]
  promptNames?: string[]
}

// Builds a ready-to-paste prompt from a loop/workflow so it can be run
// directly in ChatGPT, Claude, Gemini, etc.
export function buildLoopPrompt(
  workflow: Workflow,
  extras: LoopPromptExtras = {}
): string {
  const noun = workflow.type === "loop" ? "loop" : "workflow"
  const steps = (workflow.steps as WorkflowStep[] | null) || []
  const sections: string[] = [
    `You are running the ${workflow.title} ${noun}.`,
  ]

  const add = (heading: string, body?: string | null) => {
    if (body && body.trim()) sections.push(`${heading}:\n${body.trim()}`)
  }

  add("Objective", workflow.description)
  if (extras.agentName) sections.push(`Assigned Agent:\n${extras.agentName}`)
  if (extras.contextNames?.length) {
    sections.push(`Use this context:\n${extras.contextNames.map((n) => `- ${n}`).join("\n")}`)
  }
  if (extras.promptNames?.length) {
    sections.push(`Use these prompts:\n${extras.promptNames.map((n) => `- ${n}`).join("\n")}`)
  }
  if (steps.length) {
    const stepLines = steps
      .map((s, i) => {
        const body = s.description?.trim() ? ` — ${s.description.trim()}` : ""
        return `${i + 1}. ${s.title}${body}`
      })
      .join("\n")
    sections.push(`Steps:\n${stepLines}`)
  }
  add("Success Criteria", workflow.success_criteria)
  add("Verification Method", workflow.verification_method)
  add("Stop Condition", workflow.stop_condition)
  add("Escalation Condition", workflow.escalation_condition)
  add("Output Format", workflow.output_format)

  return sections.join("\n\n")
}
