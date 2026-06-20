export const STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "approved", label: "Approved" },
  { value: "archived", label: "Archived" },
] as const

export const PROMPT_CATEGORIES = [
  { value: "content", label: "Content" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "operations", label: "Operations" },
  { value: "research", label: "Research" },
  { value: "strategy", label: "Strategy" },
  { value: "other", label: "Other" },
] as const

export const CONTEXT_ASSET_TYPES = [
  { value: "brand_voice", label: "Brand Voice" },
  { value: "audience", label: "Audience" },
  { value: "offer", label: "Offer" },
  { value: "product", label: "Product" },
  { value: "company_rules", label: "Company Rules" },
  { value: "industry", label: "Industry" },
  { value: "competitor", label: "Competitor" },
  { value: "other", label: "Other" },
] as const

// The six AI Foundation categories (the core organizing layer).
export const FOUNDATION_CATEGORIES = [
  { value: "brand_identity", label: "Brand Identity" },
  { value: "voice_messaging", label: "Voice & Messaging" },
  { value: "products_services", label: "Products & Services" },
  { value: "customers_personas", label: "Customers & Personas" },
  { value: "company_knowledge", label: "Company Knowledge" },
  { value: "examples_reference", label: "Examples & Reference Material" },
] as const

// Status lifecycle for AI Foundation assets (adds needs_review for governance).
export const FOUNDATION_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "needs_review", label: "Needs Review" },
  { value: "approved", label: "Approved" },
  { value: "archived", label: "Archived" },
] as const

export const AGENT_PLATFORMS = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "claude", label: "Claude" },
  { value: "gemini", label: "Gemini" },
  { value: "custom", label: "Custom" },
  { value: "other", label: "Other" },
] as const

// Expanded status set for agents (governance lifecycle).
export const AGENT_STATUSES = [
  { value: "draft", label: "Draft" },
  { value: "experimental", label: "Experimental" },
  { value: "needs_review", label: "Needs Review" },
  { value: "approved", label: "Approved" },
  { value: "archived", label: "Archived" },
] as const

export const DEPARTMENTS = [
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "operations", label: "Operations" },
  { value: "product", label: "Product" },
  { value: "engineering", label: "Engineering" },
  { value: "finance", label: "Finance" },
  { value: "people", label: "People / HR" },
  { value: "legal", label: "Legal" },
  { value: "customer_success", label: "Customer Success" },
  { value: "executive", label: "Executive" },
  { value: "other", label: "Other" },
] as const

export const RISK_LEVELS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const

// Phase one offers Workflow + Loop; checklist/sop reserved for later.
export const WORKFLOW_TYPES = [
  { value: "workflow", label: "Workflow" },
  { value: "loop", label: "Loop" },
] as const
