// Single source of truth for the pricing page. Cards, comparison table,
// free plan, and FAQ all read from here so copy lives in one place.

export interface Plan {
  id: "starter" | "team" | "enterprise"
  name: string
  description: string
  priceMonthly: string
  priceAnnual: string | null
  priceNote: string | null
  badge: string | null
  ctaLabel: string
  ctaHref: string
  highlighted: boolean
  features: string[]
}

export const plans: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    description:
      "For individuals and small teams organizing their AI assets for the first time.",
    priceMonthly: "$19",
    priceAnnual: "$190",
    priceNote: "or $190/year",
    badge: null,
    ctaLabel: "Start Starter",
    ctaHref: "/signup?plan=starter",
    highlighted: false,
    features: [
      "1 workspace",
      "5 users included",
      "100 AI assets",
      "Prompts, context, agents, workflows, and images",
      "Global search",
      "Tags and favorites",
      "Basic governance status labels",
      "Copy/export assets to AI tools",
    ],
  },
  {
    id: "team",
    name: "Team",
    description:
      "For teams standardizing how AI is used across people, departments, and tools.",
    priceMonthly: "$79",
    priceAnnual: "$790",
    priceNote: "or $790/year",
    badge: "Most popular",
    ctaLabel: "Start Team",
    ctaHref: "/signup?plan=team",
    highlighted: true,
    features: [
      "5 workspaces or departments",
      "25 users included",
      "1,000 AI assets",
      "Unlimited prompts, agents, workflows, and image records",
      "Context library",
      "My Dispatch",
      "Usage tracking",
      "Ownership and review dates",
      "Tool registry",
      "Team governance dashboard",
      "Structured export for third-party AI tools",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "For organizations that need advanced governance, security controls, permissions, and managed implementation.",
    priceMonthly: "Custom",
    priceAnnual: null,
    priceNote: null,
    badge: null,
    ctaLabel: "Talk to ZINC",
    ctaHref: "/contact?plan=enterprise",
    highlighted: false,
    features: [
      "Custom users and workspaces",
      "Custom asset limits",
      "Advanced governance",
      "Approval workflows",
      "Audit logs",
      "Role-based permissions",
      "SSO",
      "Multi-brand or multi-client workspaces",
      "Managed onboarding",
      "Custom agents, workflows, and governance frameworks",
      "Priority support",
    ],
  },
]

export const freePlan = {
  eyebrow: "Free forever",
  description:
    "Explore Dispatch with 1 workspace, 2 users, 25 AI assets, 2 agents, 2 workflows, and basic search.",
  ctaLabel: "Create Free Account",
  ctaHref: "/signup?plan=free",
}

// Comparison table. Cell values are either a string (rendered as text) or a
// boolean (rendered as a check / dash).
export interface ComparisonRow {
  feature: string
  starter: string | boolean
  team: string | boolean
  enterprise: string | boolean
}

export const comparisonRows: ComparisonRow[] = [
  { feature: "Workspaces", starter: "1", team: "5", enterprise: "Custom" },
  { feature: "Users included", starter: "5", team: "25", enterprise: "Custom" },
  { feature: "AI assets", starter: "100", team: "1,000", enterprise: "Custom" },
  { feature: "Prompts", starter: "Included", team: "Unlimited", enterprise: "Unlimited / Custom" },
  { feature: "Context assets", starter: "Included", team: "Unlimited", enterprise: "Unlimited / Custom" },
  { feature: "Agents", starter: "Included", team: "Unlimited", enterprise: "Unlimited / Custom" },
  { feature: "Workflows / loops", starter: "Included", team: "Unlimited", enterprise: "Unlimited / Custom" },
  { feature: "Image library", starter: "Included", team: "Unlimited records", enterprise: "Unlimited / Custom" },
  { feature: "Global search", starter: true, team: true, enterprise: true },
  { feature: "Tags", starter: true, team: true, enterprise: true },
  { feature: "Favorites / My Dispatch", starter: true, team: true, enterprise: true },
  { feature: "Usage tracking", starter: false, team: "Basic", enterprise: "Advanced" },
  { feature: "Tool registry", starter: false, team: true, enterprise: true },
  { feature: "Governance dashboard", starter: "Basic", team: "Team-level", enterprise: "Advanced" },
  { feature: "Review dates", starter: "Basic", team: true, enterprise: true },
  { feature: "Ownership fields", starter: "Basic", team: true, enterprise: true },
  { feature: "Approval workflows", starter: false, team: "Basic / Optional", enterprise: true },
  { feature: "Audit logs", starter: false, team: false, enterprise: true },
  { feature: "Role-based permissions", starter: false, team: "Basic", enterprise: "Advanced" },
  { feature: "SSO", starter: false, team: false, enterprise: true },
  { feature: "Managed onboarding", starter: false, team: "Optional", enterprise: "Included" },
  { feature: "Priority support", starter: false, team: "Standard", enterprise: "Priority" },
]

export const faqs = [
  {
    question: "Why isn’t Dispatch priced primarily by user seat?",
    answer:
      "Dispatch is designed to manage organizational AI knowledge, not punish teams for collaboration. Each plan includes a generous number of users. Pricing is based more on the amount of AI assets, governance, and operational structure your organization needs.",
  },
  {
    question: "What counts as an AI asset?",
    answer:
      "AI assets include prompts, context records, agents, workflows, loops, image records, governance policies, tool records, and reusable AI operating materials stored in Dispatch.",
  },
  {
    question: "Does Dispatch replace ChatGPT, Claude, or Midjourney?",
    answer:
      "No. Dispatch is the system of record above those tools. Your team can continue using the AI tools they prefer while Dispatch keeps the organization’s approved assets, context, agents, workflows, and governance organized in one place.",
  },
  {
    question: "Can we start for free?",
    answer:
      "Yes. The free plan is designed to help individuals and small teams organize a limited set of AI assets before upgrading.",
  },
  {
    question: "Can we invite our whole team?",
    answer:
      "Yes. Starter and Team include multiple users, and Enterprise can support larger organizations with custom access, permissions, and governance needs.",
  },
  {
    question: "Can ZINC help set this up for us?",
    answer:
      "Yes. ZINC can help create your initial context library, agents, workflows, governance rules, and AI operating structure.",
  },
  {
    question: "What happens if our AI tools change?",
    answer:
      "Dispatch keeps your AI assets independent of any one tool. If your team changes from ChatGPT to Claude, Gemini, Perplexity, or another platform, your organizational AI assets remain organized in Dispatch.",
  },
  {
    question: "Is Dispatch for agencies?",
    answer:
      "Yes. Agencies can use Dispatch to manage their own AI assets or create organized AI enablement systems for clients.",
  },
]
