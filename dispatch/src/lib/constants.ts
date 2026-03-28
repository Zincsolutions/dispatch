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

export const AGENT_PLATFORMS = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "claude", label: "Claude" },
  { value: "gemini", label: "Gemini" },
  { value: "custom", label: "Custom" },
  { value: "other", label: "Other" },
] as const
