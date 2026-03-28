import type { Database } from "./database"

export type Organization = Database["public"]["Tables"]["organizations"]["Row"]
export type OrganizationInsert = Database["public"]["Tables"]["organizations"]["Insert"]

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export type OrganizationMember = Database["public"]["Tables"]["organization_members"]["Row"]

export type Prompt = Database["public"]["Tables"]["prompts"]["Row"]
export type PromptInsert = Database["public"]["Tables"]["prompts"]["Insert"]
export type PromptUpdate = Database["public"]["Tables"]["prompts"]["Update"]

export type ContextAsset = Database["public"]["Tables"]["context_assets"]["Row"]
export type ContextAssetInsert = Database["public"]["Tables"]["context_assets"]["Insert"]
export type ContextAssetUpdate = Database["public"]["Tables"]["context_assets"]["Update"]

export type Agent = Database["public"]["Tables"]["agents"]["Row"]
export type AgentInsert = Database["public"]["Tables"]["agents"]["Insert"]
export type AgentUpdate = Database["public"]["Tables"]["agents"]["Update"]

export type Workflow = Database["public"]["Tables"]["workflows"]["Row"]
export type WorkflowInsert = Database["public"]["Tables"]["workflows"]["Insert"]
export type WorkflowUpdate = Database["public"]["Tables"]["workflows"]["Update"]

export type WorkflowStep = {
  order: number
  title: string
  description: string
}

export type Status = "draft" | "approved" | "archived"
