# Dispatch — Routes and Pages (MVP)

## Overview

Dispatch is a multi-tenant AI Vault application.

All core functionality lives inside authenticated routes.
Users must be logged in to access any vault data.

---

## Public Routes

### `/`
- Redirect logic:
  - If authenticated → `/dashboard`
  - If not authenticated → `/login`

---

### `/login`
- Email/password login (Supabase Auth)
- Simple, clean UI

---

### `/signup` (Optional for MVP)
- Can be included or deferred
- Allows user to:
  - create account
  - create or join an organization

If not implemented:
→ users can be seeded manually

---

## Protected Routes (App)

All routes below require authentication.

---

## Dashboard

### `/dashboard`

Purpose:
- Provide quick visibility into the organization’s vault

Displays:
- recent prompts
- recent context assets
- recent agents
- recent workflows

No analytics. No complexity.

---

## Prompts

### `/prompts`
List view of all prompts in the organization.

Features:
- search
- filter (status, tags, category)
- “create new” button

---

### `/prompts/new`
Create prompt form.

---

### `/prompts/[id]`
View prompt detail.

---

### `/prompts/[id]/edit`
Edit prompt.

---

## Context Assets

### `/context`
List view of all context assets.

---

### `/context/new`
Create context asset.

---

### `/context/[id]`
View context asset.

---

### `/context/[id]/edit`
Edit context asset.

---

## Agents

### `/agents`
List view of all agents.

---

### `/agents/new`
Create agent.

---

### `/agents/[id]`
View agent.

---

### `/agents/[id]/edit`
Edit agent.

---

## Workflows

### `/workflows`
List view of workflows.

---

### `/workflows/new`
Create workflow.

---

### `/workflows/[id]`
View workflow.

---

### `/workflows/[id]/edit`
Edit workflow.

---

## Settings

### `/settings`

Basic settings page.

Includes:
- organization name
- user info
- sign out

---

## Navigation (Global)

Main sidebar or top nav:

- Dashboard
- Prompts
- Context
- Agents
- Workflows
- Settings

---

## Notes

- Keep routing simple and predictable
- Avoid nested complexity
- Use consistent patterns across all objects
- Focus on usability over clever structure