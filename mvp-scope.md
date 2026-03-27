# Dispatch — MVP Scope

## MVP Goal

Build the first usable version of Dispatch: a secure, multi-tenant AI Vault where companies can organize, manage, and access their AI assets in one place.

This is not a full AI platform.

This is a **structured vault + system of record** for:
- prompts
- context
- agents
- workflows

The MVP proves that companies want a dedicated place to:
- store AI knowledge
- standardize usage
- protect their AI-driven IP
- reduce duplication across teams

---

## Core MVP Promise

Dispatch gives a company a private AI Vault that is:

- structured (not messy like docs)
- centralized (not scattered across tools)
- organization-specific (multi-tenant)
- easy to use and contribute to
- ready to expand into a larger system later

---

## Primary User

The MVP is designed for:

### Primary User
- Founder, strategist, or team lead responsible for AI adoption

### Secondary Users
- Team members who:
  - browse assets
  - use prompts and workflows
  - contribute improvements

---

## Core MVP Objects (DO NOT ADD MORE)

These four objects define the entire MVP:

### 1. Prompts
Structured prompt entries used across the organization.

Fields:
- title
- description
- prompt_body
- category
- tags
- status (draft, approved, archived)
- created_by
- organization_id
- timestamps

---

### 2. Context Assets
Reusable knowledge used to improve AI outputs.

Examples:
- brand voice
- audience definition
- offer summary
- product details
- company rules

Fields:
- title
- description
- content
- asset_type
- tags
- status
- created_by
- organization_id
- timestamps

---

### 3. Agents
A registry of AI agents or assistants.

Examples:
- blog writer agent
- ad copy generator
- research assistant
- landing page builder

Fields:
- name
- description
- purpose
- platform (ChatGPT, Claude, etc.)
- setup_notes
- tags
- status
- created_by
- organization_id
- timestamps

---

### 4. Workflows
Simple representations of repeatable processes.

Examples:
- blog creation workflow
- campaign workflow
- landing page workflow

Fields:
- title
- description
- steps (text or structured)
- related_prompts
- related_context
- related_agents
- tags
- status
- created_by
- organization_id
- timestamps

---

## Core MVP Features (STRICT)

### 1. Authentication
- email/password login (Supabase Auth)
- protected application routes

---

### 2. Multi-Tenant Structure
- users belong to an organization
- all data is scoped to organization
- users cannot access other organizations

---

### 3. Dashboard
A simple overview page.

Shows:
- recent prompts
- recent context assets
- recent agents
- recent workflows

Purpose:
→ quick orientation, not analytics

---

### 4. CRUD for All Core Objects

Users can:
- create
- view
- edit
- delete

for:
- prompts
- context assets
- agents
- workflows

---

### 5. Search and Filtering

Users can:
- search by keyword
- filter by:
  - tags
  - status
  - category/type (where applicable)

Keep implementation simple.

---

### 6. Basic Relationships

Allow linking between objects:

- workflows ↔ prompts
- workflows ↔ context assets
- workflows ↔ agents

This can be simple (IDs or references), not complex UI.

---

### 7. Basic Status System

Each object supports:
- draft
- approved
- archived

No approval workflow needed yet.

---

### 8. Navigation Structure

Main navigation includes:
- Dashboard
- Prompts
- Context
- Agents
- Workflows
- Settings

No additional sections.

---

## UX Priorities

The app should feel:

- clean
- fast
- structured
- professional
- purposeful (not like a generic doc tool)

Prioritize:
- quick data entry
- clear hierarchy
- strong empty states
- obvious organization context

Avoid:
- over-design
- excessive nesting
- complex UI interactions

---

## Explicitly OUT of Scope (DO NOT BUILD)

This is critical.

### AI Execution
- no prompt running inside the app
- no LLM API integrations
- no chat interface
- no multi-model comparison

---

### Intelligence Layer
- no leaderboard
- no scoring system
- no usage tracking
- no “best prompt” automation

---

### Advanced Systems
- no version history (beyond updated_at)
- no audit logs
- no activity feeds
- no commenting system

---

### Integrations
- no Slack
- no Asana
- no Shopify
- no Google integrations
- no Zapier/Make

---

### Permissions
- no granular permissions
- no role hierarchy beyond basic roles

---

### Billing
- no Stripe
- no subscriptions
- no pricing logic

---

### Notifications
- no email notifications
- no in-app notifications

---

### File / Media Handling
- no complex file uploads
- no DAM system
- no image pipelines

---

## MVP Success Criteria

The MVP is successful if:

1. A user can log in and access a private organization vault  
2. A company can store and organize prompts, context, agents, and workflows  
3. Users can easily browse and find assets  
4. The product feels structured and intentional (not like Notion)  
5. It is demo-ready for 3–5 clients  
6. The data model supports future expansion  

---

## Strategic Constraint

This MVP is about:

→ Structure  
→ Organization  
→ Ownership  

NOT about:
→ automation  
→ execution  
→ intelligence  

Those come later.

---

## Product Boundary (Important)

Dispatch is:

- the system that organizes AI work  
- the vault that protects AI assets  

Dispatch is NOT:

- an AI tool itself  
- a chatbot  
- a replacement for ChatGPT or Claude  

It sits above them.

---

## Guiding Principle

If a feature does not directly support:

- storing
- organizing
- linking
- or retrieving AI assets

→ it does not belong in MVP