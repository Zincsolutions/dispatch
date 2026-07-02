import type { Metadata } from "next"
import Link from "next/link"
import { getTools } from "@/lib/queries/governance"
import { ToolsTable } from "./tools-table"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = { title: "Tool Registry" }

export default async function ToolsPage() {
  const tools = await getTools()

  return (
    <div className="max-w-3xl">
      <Link
        href="/governance"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Governance
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Tool Registry</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Every AI tool your team uses — what&apos;s approved, what&apos;s being
        tested, what&apos;s off-limits, and the data rules for each.
      </p>
      <ToolsTable tools={tools} />
    </div>
  )
}
