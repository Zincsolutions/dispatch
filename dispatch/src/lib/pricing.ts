// Single source of truth for the pricing page. Cards, comparison table,
// and FAQ all read from here so copy lives in one place.

export interface Plan {
  id: "personal" | "starter" | "team" | "enterprise"
  name: string
  description: string
  priceMonthly: string
  priceNote: string | null
  featuresNote: string | null
  badge: string | null
  ctaLabel: string
  ctaHref: string
  highlighted: boolean
  features: string[]
}

export const plans: Plan[] = [
  {
    id: "personal",
    name: "Personal",
    description:
      "For individuals organizing prompts, workflows, and AI assets for personal use.",
    priceMonthly: "$0",
    priceNote: "Free forever",
    featuresNote: null,
    badge: null,
    ctaLabel: "Get Started Free",
    ctaHref: "/signup?plan=personal",
    highlighted: false,
    features: [
      "1 user",
      "25 prompts",
      "10 workflows",
      "5 agents",
      "50 image assets",
      "Basic AI Foundation",
      "Personal collections",
      "Basic search",
      "Community templates",
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description:
      "For small teams centralizing prompts, workflows, agents, and AI assets in one shared workspace.",
    priceMonthly: "$29",
    priceNote: "per month",
    featuresNote: "Everything in Personal, plus:",
    badge: null,
    ctaLabel: "Start Free Trial",
    ctaHref: "/signup?plan=starter",
    highlighted: false,
    features: [
      "Up to 10 users",
      "Unlimited prompts",
      "Unlimited workflows",
      "Unlimited agents",
      "Unlimited image assets",
      "Shared team workspace",
      "AI Foundation assets",
      "Brand & context assets",
      "Favorites and saved assets",
      "Basic permissions",
      "Activity history",
    ],
  },
  {
    id: "team",
    name: "Team",
    description:
      "For organizations that need to manage AI knowledge, workflows, agents, and governance across teams.",
    priceMonthly: "$99",
    priceNote: "per month",
    featuresNote: "Everything in Starter, plus:",
    badge: "Recommended",
    ctaLabel: "Start Free Trial",
    ctaHref: "/signup?plan=team",
    highlighted: true,
    features: [
      "Up to 50 users",
      "Governance Center",
      "Approval workflows",
      "Review queues",
      "Policy acknowledgements",
      "Tool registry",
      "Department workspaces",
      "Advanced permissions",
      "Organization dashboard",
      "Usage reporting",
      "Status labels (Approved, Draft, Experimental, Needs Review)",
      "Priority support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description:
      "For larger organizations requiring enterprise controls, custom workflows, compliance support, and deeper integration.",
    priceMonthly: "Custom",
    priceNote: "Contact sales",
    featuresNote: "Everything in Team, plus:",
    badge: null,
    ctaLabel: "Contact Sales",
    ctaHref: "/contact?plan=enterprise",
    highlighted: false,
    features: [
      "Unlimited users",
      "SSO and SCIM",
      "Custom roles",
      "Audit logs",
      "Advanced governance controls",
      "Enterprise security",
      "API access",
      "Custom integrations",
      "Dedicated success manager",
      "Onboarding and training",
      "Custom usage limits",
    ],
  },
]

// Comparison table, grouped by category. Cell values are either a string
// (rendered as text) or a boolean (rendered as a check / dash).
export interface ComparisonRow {
  group: string
  feature: string
  personal: string | boolean
  starter: string | boolean
  team: string | boolean
  enterprise: string | boolean
}

export const comparisonRows: ComparisonRow[] = [
  // Core Workspace
  { group: "Core Workspace", feature: "Users", personal: "1", starter: "Up to 10", team: "Up to 50", enterprise: "Unlimited" },
  { group: "Core Workspace", feature: "Prompts", personal: "25", starter: "Unlimited", team: "Unlimited", enterprise: "Unlimited" },
  { group: "Core Workspace", feature: "Workflows", personal: "10", starter: "Unlimited", team: "Unlimited", enterprise: "Unlimited" },
  { group: "Core Workspace", feature: "Agents", personal: "5", starter: "Unlimited", team: "Unlimited", enterprise: "Unlimited" },
  { group: "Core Workspace", feature: "Image assets", personal: "50", starter: "Unlimited", team: "Unlimited", enterprise: "Unlimited" },
  { group: "Core Workspace", feature: "AI Foundation", personal: "Basic", starter: true, team: true, enterprise: true },
  { group: "Core Workspace", feature: "Search", personal: "Basic", starter: true, team: true, enterprise: true },
  { group: "Core Workspace", feature: "Collections", personal: true, starter: true, team: true, enterprise: true },

  // Collaboration
  { group: "Collaboration", feature: "Shared workspace", personal: false, starter: true, team: true, enterprise: true },
  { group: "Collaboration", feature: "Favorites & saved assets", personal: false, starter: true, team: true, enterprise: true },
  { group: "Collaboration", feature: "Activity history", personal: false, starter: true, team: true, enterprise: true },
  { group: "Collaboration", feature: "Team sharing", personal: false, starter: true, team: true, enterprise: true },
  { group: "Collaboration", feature: "Department workspaces", personal: false, starter: false, team: true, enterprise: true },

  // Governance
  { group: "Governance", feature: "Governance Center", personal: false, starter: false, team: true, enterprise: true },
  { group: "Governance", feature: "Approval workflows", personal: false, starter: false, team: true, enterprise: true },
  { group: "Governance", feature: "Review queues", personal: false, starter: false, team: true, enterprise: true },
  { group: "Governance", feature: "Policy acknowledgements", personal: false, starter: false, team: true, enterprise: true },
  { group: "Governance", feature: "Tool registry", personal: false, starter: false, team: true, enterprise: true },
  { group: "Governance", feature: "Status labels", personal: false, starter: false, team: true, enterprise: true },

  // Security & Admin
  { group: "Security & Admin", feature: "Basic permissions", personal: false, starter: true, team: true, enterprise: true },
  { group: "Security & Admin", feature: "Advanced permissions", personal: false, starter: false, team: true, enterprise: true },
  { group: "Security & Admin", feature: "Organization dashboard", personal: false, starter: false, team: true, enterprise: true },
  { group: "Security & Admin", feature: "Custom roles", personal: false, starter: false, team: false, enterprise: true },
  { group: "Security & Admin", feature: "SSO", personal: false, starter: false, team: false, enterprise: true },
  { group: "Security & Admin", feature: "SCIM", personal: false, starter: false, team: false, enterprise: true },
  { group: "Security & Admin", feature: "Audit logs", personal: false, starter: false, team: false, enterprise: true },

  // Support
  { group: "Support", feature: "Community support", personal: true, starter: true, team: true, enterprise: true },
  { group: "Support", feature: "Standard support", personal: false, starter: true, team: true, enterprise: true },
  { group: "Support", feature: "Priority support", personal: false, starter: false, team: true, enterprise: true },
  { group: "Support", feature: "Dedicated success manager", personal: false, starter: false, team: false, enterprise: true },
  { group: "Support", feature: "Onboarding & training", personal: false, starter: false, team: false, enterprise: true },
]

export const faqs = [
  {
    question: "Is there a free plan?",
    answer:
      "Yes. The Personal plan is free forever — built for individuals organizing prompts, workflows, and AI assets for their own use.",
  },
  {
    question: "What is included in the Personal plan?",
    answer:
      "Personal includes 1 user, 25 prompts, 10 workflows, 5 agents, 50 image assets, a basic AI Foundation, personal collections, and basic search. Governance, approvals, and team sharing are part of the paid plans.",
  },
  {
    question: "Can I upgrade from Personal to Starter or Team?",
    answer:
      "Anytime. Your prompts, workflows, agents, and assets carry over — upgrading simply unlocks shared workspaces, more capacity, and (on Team) governance.",
  },
  {
    question: "Do you offer monthly and yearly billing?",
    answer:
      "Yes. You can pay monthly or save with annual billing. Annual plans save up to 20%.",
  },
  {
    question: "Which plan includes governance?",
    answer:
      "The Governance Center — approval workflows, review queues, policy acknowledgements, the tool registry, and status labels — is included on Team and Enterprise.",
  },
  {
    question: "What are AI Foundation assets?",
    answer:
      "AI Foundation is your organization's shared source of truth: brand voice, company context, approved source materials, SOPs, image direction, and reusable standards that keep AI outputs consistent.",
  },
  {
    question: "Can I invite my team?",
    answer:
      "Yes. Starter includes up to 10 users, Team up to 50, and Enterprise supports unlimited users with advanced permissions.",
  },
  {
    question: "Does Dispatch support approval workflows?",
    answer:
      "Yes, on Team and Enterprise. Assets can move through Draft, Needs Review, and Approved, with review queues so the right people sign off before anything is used in production.",
  },
  {
    question: "Is there an Enterprise plan?",
    answer:
      "Yes. Enterprise adds SSO, SCIM, custom roles, audit logs, advanced governance and security controls, API access, custom integrations, and a dedicated success manager.",
  },
  {
    question: "Do you offer onboarding or implementation support?",
    answer:
      "Yes. Team includes priority support, and Enterprise includes dedicated onboarding and training to stand up your AI operating system.",
  },
  {
    question: "Can ZINC help set up Dispatch for my company?",
    answer:
      "Yes. ZINC can help build your initial AI Foundation, agents, workflows, and governance framework so Dispatch reflects how your organization actually works.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Plans are month-to-month (or annual), and you can change or cancel your plan whenever you need to.",
  },
]
