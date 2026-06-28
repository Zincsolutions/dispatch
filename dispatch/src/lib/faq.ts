// FAQ content as a data-driven collection (CMS-style) so questions can be
// added, edited, reordered, tagged, and recategorized without touching page
// layout. Designed to scale to 200+ questions while keeping search, filtering,
// anchors, and structured data working.

export interface FaqItem {
  /** Stable slug used for anchors (#id) and the ?q= deep-link param. */
  id: string
  q: string
  a: string
  /** Optional bullet list rendered (and serialized into schema) after `a`. */
  bullets?: string[]
  /** Contextual internal links shown under the answer. */
  links?: { label: string; href: string }[]
}

export interface FaqCategory {
  /** Stable slug used for the category anchor (#id) and nav. */
  id: string
  title: string
  /** Descriptive intro so the category stands on its own semantically. */
  intro: string
  items: FaqItem[]
}

export const faqCategories: FaqCategory[] = [
  {
    id: "ai-operating-systems",
    title: "AI Operating Systems",
    intro:
      "An AI Operating System is the foundation for using AI as an organization rather than a collection of individuals. These questions cover what an AI Operating System is, the problems it solves, and what every one should include.",
    items: [
      {
        id: "what-is-an-ai-operating-system",
        q: "What is an AI Operating System?",
        a: "An AI Operating System is a centralized platform that helps organizations organize, share, govern, and improve all of their AI knowledge, prompts, agents, workflows, documentation, and institutional expertise. Instead of AI living inside individual chat conversations, it becomes a shared organizational asset that teams can continuously build upon.",
        links: [
          {
            label: "Read: Why you need an AI operating system first",
            href: "/blog/ai-operating-system-before-another-tool",
          },
        ],
      },
      {
        id: "why-does-a-company-need-an-ai-operating-system",
        q: "Why does a company need an AI Operating System?",
        a: "As AI adoption grows, organizations often accumulate hundreds of prompts, workflows, and AI assets across different teams. An AI Operating System provides a single source of truth that helps employees discover, reuse, improve, and govern AI resources rather than recreating them.",
      },
      {
        id: "is-an-ai-operating-system-the-same-as-chatgpt",
        q: "Is an AI Operating System the same as ChatGPT?",
        a: "No. ChatGPT is an AI application. An AI Operating System organizes how your entire organization uses AI applications such as ChatGPT, Claude, Gemini, Microsoft Copilot, custom GPTs, and AI agents.",
      },
      {
        id: "what-problems-does-an-ai-operating-system-solve",
        q: "What problems does an AI Operating System solve?",
        a: "An AI Operating System helps solve:",
        bullets: [
          "Duplicate prompts",
          "Lost AI knowledge",
          "Inconsistent AI outputs",
          "Lack of governance",
          "Poor collaboration",
          "Knowledge loss when employees leave",
          "AI adoption challenges",
          "Difficulty scaling AI across departments",
        ],
        links: [{ label: "Explore the Resource Center", href: "/blog" }],
      },
      {
        id: "who-should-use-an-ai-operating-system",
        q: "Who should use an AI Operating System?",
        a: "Organizations with multiple employees using AI, especially marketing teams, sales teams, operations, HR, customer service, leadership, and agencies, benefit from an AI Operating System because it centralizes knowledge and improves consistency.",
      },
      {
        id: "what-is-organizational-ai",
        q: "What is organizational AI?",
        a: "Organizational AI is the practice of applying artificial intelligence across an entire business rather than through isolated individual usage. It emphasizes shared knowledge, collaboration, governance, and long-term organizational learning.",
      },
      {
        id: "how-is-an-ai-operating-system-different-from-a-knowledge-base",
        q: "How is an AI Operating System different from a knowledge base?",
        a: "A traditional knowledge base stores information. An AI Operating System stores information while also organizing prompts, AI agents, workflows, automations, governance policies, brand context, reusable templates, and collaboration around AI.",
      },
      {
        id: "is-an-ai-operating-system-only-for-enterprise-companies",
        q: "Is an AI Operating System only for enterprise companies?",
        a: "No. Small businesses often experience AI chaos much sooner because fewer people are responsible for many different roles. An AI Operating System helps organizations of all sizes organize their AI knowledge from the beginning.",
      },
      {
        id: "what-should-every-ai-operating-system-include",
        q: "What should every AI Operating System include?",
        a: "Every AI Operating System should include:",
        bullets: [
          "Prompt library",
          "AI agent library",
          "Workflow documentation",
          "Brand guidelines",
          "AI governance",
          "Search",
          "User permissions",
          "Version history",
          "Context documentation",
          "Team collaboration",
        ],
      },
      {
        id: "what-is-the-biggest-benefit-of-an-ai-operating-system",
        q: "What is the biggest benefit of an AI Operating System?",
        a: "The greatest benefit is turning individual AI experimentation into institutional knowledge that every employee can use.",
      },
    ],
  },
  {
    id: "ai-governance",
    title: "AI Governance",
    intro:
      "AI governance is how an organization keeps its AI use consistent, secure, and aligned with company standards without slowing teams down. These questions cover what governance is, who owns it, and how it improves quality and brand consistency.",
    items: [
      {
        id: "what-is-ai-governance",
        q: "What is AI governance?",
        a: "AI governance is the framework an organization uses to ensure AI is deployed consistently, responsibly, securely, and in alignment with company standards and business goals.",
        links: [
          {
            label: "Read: AI governance is about confidence, not control",
            href: "/blog/ai-governance-is-about-confidence",
          },
        ],
      },
      {
        id: "why-is-ai-governance-important",
        q: "Why is AI governance important?",
        a: "Without governance, employees may unknowingly create inconsistent messaging, expose sensitive information, duplicate work, or rely on outdated prompts and workflows.",
      },
      {
        id: "does-ai-governance-reduce-innovation",
        q: "Does AI governance reduce innovation?",
        a: "No. Good governance accelerates innovation by giving employees trusted resources and proven starting points rather than forcing them to reinvent everything.",
      },
      {
        id: "what-should-an-ai-governance-policy-include",
        q: "What should an AI governance policy include?",
        a: "A governance policy should define approved AI tools, security guidelines, prompt standards, content review processes, brand requirements, and ownership of AI assets.",
      },
      {
        id: "who-owns-ai-governance",
        q: "Who owns AI governance?",
        a: "AI governance is most effective when shared between executive leadership, operations, IT, legal, and department leaders.",
      },
      {
        id: "can-ai-governance-improve-brand-consistency",
        q: "Can AI governance improve brand consistency?",
        a: "Yes. Centralized prompts, approved templates, and shared brand context help ensure AI-generated content reflects a consistent voice across the organization.",
      },
      {
        id: "is-ai-governance-only-about-security",
        q: "Is AI governance only about security?",
        a: "No. Governance also includes collaboration, knowledge sharing, quality control, version management, and continuous improvement.",
      },
      {
        id: "when-should-an-organization-implement-ai-governance",
        q: "When should an organization implement AI governance?",
        a: "Organizations should establish governance as soon as multiple employees begin using AI regularly.",
      },
    ],
  },
  {
    id: "prompt-management",
    title: "Prompt Management",
    intro:
      "Prompts are real organizational assets, but most teams scatter them across chats and docs. These questions cover how to organize, version, categorize, and share prompts so your best work is reusable instead of constantly rebuilt.",
    items: [
      {
        id: "what-is-prompt-management",
        q: "What is prompt management?",
        a: "Prompt management is the process of organizing, documenting, categorizing, improving, and sharing prompts across an organization.",
        links: [
          {
            label: "Read: How to end AI prompt chaos",
            href: "/blog/ai-prompt-chaos",
          },
        ],
      },
      {
        id: "why-shouldnt-prompts-live-inside-chatgpt-conversations",
        q: "Why shouldn't prompts live inside ChatGPT conversations?",
        a: "Chat conversations are difficult to search, impossible to govern across teams, and easily lost over time.",
      },
      {
        id: "what-makes-a-good-prompt-library",
        q: "What makes a good prompt library?",
        a: "A quality prompt library includes categories, tags, ownership, version history, search, descriptions, and examples.",
        links: [
          {
            label: "Read: From prompt library to AI operating system",
            href: "/blog/from-prompt-library-to-ai-operating-system",
          },
        ],
      },
      {
        id: "should-prompts-have-version-control",
        q: "Should prompts have version control?",
        a: "Yes. As prompts evolve, organizations should maintain revision history and document improvements over time.",
      },
      {
        id: "how-should-prompts-be-organized",
        q: "How should prompts be organized?",
        a: "Prompts should be categorized by department, function, use case, AI model, business objective, and audience.",
      },
      {
        id: "can-prompts-become-intellectual-property",
        q: "Can prompts become intellectual property?",
        a: "Absolutely. High-performing prompts often represent significant organizational knowledge and competitive advantage.",
      },
      {
        id: "who-should-be-allowed-to-create-prompts",
        q: "Who should be allowed to create prompts?",
        a: "Every employee should be encouraged to contribute, while designated owners review and approve prompts for broader organizational use.",
      },
      {
        id: "why-do-organizations-keep-recreating-prompts",
        q: "Why do organizations keep recreating prompts?",
        a: "Without centralized prompt management, employees often have no visibility into prompts already created by others.",
      },
    ],
  },
  {
    id: "ai-collaboration",
    title: "AI Collaboration",
    intro:
      "AI gets more valuable when teams build on each other's work instead of starting from scratch. These questions cover how teams collaborate with AI, preserve institutional memory, and make AI knowledge searchable and shareable.",
    items: [
      {
        id: "how-do-teams-collaborate-with-ai",
        q: "How do teams collaborate with AI?",
        a: "Teams collaborate by sharing prompts, workflows, AI agents, documentation, and lessons learned through a centralized platform.",
      },
      {
        id: "why-is-ai-collaboration-difficult-today",
        q: "Why is AI collaboration difficult today?",
        a: "Most AI knowledge remains inside private conversations, making it inaccessible to the rest of the organization.",
      },
      {
        id: "can-ai-improve-cross-department-collaboration",
        q: "Can AI improve cross-department collaboration?",
        a: "Yes. Shared AI assets help marketing, sales, HR, operations, and leadership build upon one another's work rather than starting from scratch.",
        links: [
          { label: "Read: Stop building AI silos", href: "/blog/stop-building-ai-silos" },
        ],
      },
      {
        id: "should-ai-assets-be-searchable",
        q: "Should AI assets be searchable?",
        a: "Yes. Search is one of the most valuable features of an AI Operating System because employees need to quickly discover existing knowledge.",
      },
      {
        id: "what-is-institutional-ai-memory",
        q: "What is institutional AI memory?",
        a: "Institutional AI memory refers to preserving an organization's AI knowledge beyond individual employees.",
        links: [
          {
            label: "Read: What happens when your best AI employee leaves?",
            href: "/blog/what-happens-when-your-best-ai-employee-leaves",
          },
        ],
      },
      {
        id: "what-happens-when-an-employee-leaves",
        q: "What happens when an employee leaves?",
        a: "Without centralized documentation, much of their AI expertise may leave with them.",
      },
      {
        id: "should-ai-workflows-be-documented",
        q: "Should AI workflows be documented?",
        a: "Yes. Documenting AI workflows makes them repeatable, measurable, and easier to improve over time.",
      },
      {
        id: "can-ai-collaboration-improve-onboarding",
        q: "Can AI collaboration improve onboarding?",
        a: "Absolutely. New employees can begin using proven prompts, workflows, and AI resources immediately.",
      },
    ],
  },
  {
    id: "ai-adoption-strategy",
    title: "AI Adoption & Strategy",
    intro:
      "Adopting AI across an organization is about people, processes, and governance, not just tools. These questions cover how companies successfully adopt and scale AI, measure success, and reach AI maturity.",
    items: [
      {
        id: "how-do-companies-successfully-adopt-ai",
        q: "How do companies successfully adopt AI?",
        a: "Successful organizations focus on people, processes, governance, and knowledge sharing, not just technology.",
      },
      {
        id: "what-are-the-biggest-barriers-to-ai-adoption",
        q: "What are the biggest barriers to AI adoption?",
        a: "Common barriers include lack of training, poor organization, inconsistent usage, security concerns, and limited visibility into existing AI efforts.",
      },
      {
        id: "should-every-department-use-ai-differently",
        q: "Should every department use AI differently?",
        a: "Yes. Each department has unique use cases, but all should operate within a shared organizational framework.",
      },
      {
        id: "how-do-you-scale-ai-across-an-organization",
        q: "How do you scale AI across an organization?",
        a: "Scaling AI requires centralized knowledge management, governance, standardized workflows, and ongoing collaboration.",
        links: [
          {
            label: "Read: How to scale AI without losing control",
            href: "/blog/scale-ai-without-losing-control",
          },
        ],
      },
      {
        id: "is-ai-replacing-employees",
        q: "Is AI replacing employees?",
        a: "In most organizations, AI enhances employees by automating repetitive work and enabling people to focus on higher-value activities.",
      },
      {
        id: "how-do-you-measure-ai-success",
        q: "How do you measure AI success?",
        a: "Organizations can measure adoption through time savings, reuse of AI assets, workflow automation, knowledge sharing, and business outcomes.",
      },
      {
        id: "what-is-ai-maturity",
        q: "What is AI maturity?",
        a: "AI maturity describes how effectively an organization has integrated AI into its people, processes, governance, and operations.",
      },
      {
        id: "what-comes-after-ai-adoption",
        q: "What comes after AI adoption?",
        a: "The next stage is organizational optimization, continuously improving and expanding shared AI knowledge.",
      },
    ],
  },
  {
    id: "dispatch-platform",
    title: "Dispatch Platform",
    intro:
      "Dispatch is an AI Operating System for organizing, governing, and scaling AI across your whole company. These questions cover what Dispatch is, who it is for, and how it complements the AI tools your team already uses.",
    items: [
      {
        id: "what-is-dispatch",
        q: "What is Dispatch?",
        a: "Dispatch is an AI Operating System that helps organizations organize, govern, search, share, and continuously improve their AI knowledge.",
        links: [
          { label: "See pricing", href: "/pricing" },
          { label: "Explore the product", href: "/#product" },
        ],
      },
      {
        id: "how-is-dispatch-different-from-a-prompt-library",
        q: "How is Dispatch different from a prompt library?",
        a: "Dispatch is designed to manage prompts alongside AI agents, workflows, documentation, governance, brand assets, context, and organizational knowledge.",
      },
      {
        id: "who-is-dispatch-designed-for",
        q: "Who is Dispatch designed for?",
        a: "Dispatch is built for organizations that want to scale AI across teams while maintaining consistency, collaboration, and governance.",
        links: [{ label: "See pricing", href: "/pricing" }],
      },
      {
        id: "can-dispatch-support-multiple-departments",
        q: "Can Dispatch support multiple departments?",
        a: "Yes. Marketing, sales, HR, operations, executive leadership, customer service, and other teams can all organize and share AI resources within a single platform.",
      },
      {
        id: "does-dispatch-replace-chatgpt",
        q: "Does Dispatch replace ChatGPT?",
        a: "No. Dispatch complements AI tools by organizing how organizations use them.",
      },
      {
        id: "how-does-dispatch-improve-ai-collaboration",
        q: "How does Dispatch improve AI collaboration?",
        a: "Dispatch makes AI knowledge searchable, reusable, governed, and accessible across departments.",
      },
      {
        id: "why-should-organizations-centralize-ai-knowledge",
        q: "Why should organizations centralize AI knowledge?",
        a: "Centralization reduces duplication, preserves institutional knowledge, improves consistency, and accelerates AI adoption.",
      },
      {
        id: "where-should-an-organization-begin",
        q: "Where should an organization begin?",
        a: "Begin by documenting your existing prompts, workflows, AI tools, and best practices. From there, create a centralized AI Operating System that allows every employee to build upon the organization's collective knowledge.",
        links: [{ label: "Book a demo", href: "/contact" }],
      },
    ],
  },
]

// Flattened helpers ---------------------------------------------------------

export function allFaqItems(): FaqItem[] {
  return faqCategories.flatMap((c) => c.items)
}

// Plain-text answer (lead + bullets) for FAQPage structured data.
export function faqAnswerText(item: FaqItem): string {
  if (!item.bullets?.length) return item.a
  return `${item.a} ${item.bullets.join(", ")}.`
}
