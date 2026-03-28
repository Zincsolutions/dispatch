# Dispatch — Database Schema (MVP)

## Overview

Dispatch is a multi-tenant application.

All data is scoped to an organization.
Users can only access data belonging to their organization.

Use Supabase (Postgres + Auth).

---

## Core Tables

---

## 1. organizations

Represents a company (vault owner).

Fields:
- id (uuid, primary key)
- name (text)
- slug (text, unique)
- created_at (timestamp)
- updated_at (timestamp)

---

## 2. profiles

Application-level user profile.

Maps to Supabase Auth user.

Fields:
- id (uuid, matches auth user id)
- email (text)
- full_name (text)
- created_at (timestamp)
- updated_at (timestamp)

---

## 3. organization_members

Links users to organizations.

Fields:
- id (uuid)
- organization_id (uuid, FK)
- user_id (uuid, FK)
- role (text: 'owner', 'member')
- created_at (timestamp)

Rules:
- each user belongs to an organization
- future: allow multiple orgs per user

---

## 4. prompts

Stores reusable prompts.

Fields:
- id (uuid)
- organization_id (uuid)
- created_by (uuid)
- title (text)
- description (text)
- prompt_body (text)
- category (text)
- tags (text[] or json)
- status (text: draft, approved, archived)
- created_at (timestamp)
- updated_at (timestamp)

---

## 5. context_assets

Stores reusable context.

Fields:
- id (uuid)
- organization_id (uuid)
- created_by (uuid)
- title (text)
- description (text)
- content (text)
- asset_type (text)
- tags (text[] or json)
- status (text)
- created_at (timestamp)
- updated_at (timestamp)

Examples of asset_type:
- brand_voice
- audience
- offer
- product
- company_rules

---

## 6. agents

Stores AI agent definitions.

Fields:
- id (uuid)
- organization_id (uuid)
- created_by (uuid)
- name (text)
- description (text)
- purpose (text)
- platform (text)
- setup_notes (text)
- tags (text[] or json)
- status (text)
- created_at (timestamp)
- updated_at (timestamp)

Examples of platform:
- chatgpt
- claude
- gemini
- custom

---

## 7. workflows

Stores process definitions.

Fields:
- id (uuid)
- organization_id (uuid)
- created_by (uuid)
- title (text)
- description (text)
- steps (text or json)
- tags (text[] or json)
- status (text)
- created_at (timestamp)
- updated_at (timestamp)

---

## Relationship Tables

---

## 8. workflow_prompts

Fields:
- id
- workflow_id
- prompt_id

---

## 9. workflow_context_assets

Fields:
- id
- workflow_id
- context_asset_id

---

## 10. workflow_agents

Fields:
- id
- workflow_id
- agent_id

---

## Multi-Tenant Rules

- Every table includes organization_id
- All queries must be scoped to organization
- Use Supabase Row Level Security (RLS)

---

## MVP Constraints

Keep it simple:
- no version history tables
- no analytics tables
- no activity tracking
- no audit logs

Focus on:
- clean CRUD
- correct relationships
- strong organization isolation