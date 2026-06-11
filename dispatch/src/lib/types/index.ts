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

export type Invitation = Database["public"]["Tables"]["invitations"]["Row"]
export type InvitationInsert = Database["public"]["Tables"]["invitations"]["Insert"]

export type UsageEvent = Database["public"]["Tables"]["usage_events"]["Row"]
export type UsageEventInsert = Database["public"]["Tables"]["usage_events"]["Insert"]

export type UsageEntityType =
  | "prompt"
  | "workflow"
  | "agent"
  | "context_asset"
  | "library_image"
export type UsageAction = "copy" | "run_chatgpt" | "run_claude"

export type GovDocument = Database["public"]["Tables"]["documents"]["Row"]
export type GovDocumentInsert = Database["public"]["Tables"]["documents"]["Insert"]
export type GovDocumentUpdate = Database["public"]["Tables"]["documents"]["Update"]

export type DocumentAcknowledgment =
  Database["public"]["Tables"]["document_acknowledgments"]["Row"]

export type RegistryTool = Database["public"]["Tables"]["tool_registry"]["Row"]
export type RegistryToolInsert = Database["public"]["Tables"]["tool_registry"]["Insert"]
export type RegistryToolUpdate = Database["public"]["Tables"]["tool_registry"]["Update"]

export type ImageCollection = Database["public"]["Tables"]["image_collections"]["Row"]

export type LibraryImage = Database["public"]["Tables"]["library_images"]["Row"]
export type LibraryImageInsert = Database["public"]["Tables"]["library_images"]["Insert"]
export type LibraryImageUpdate = Database["public"]["Tables"]["library_images"]["Update"]
