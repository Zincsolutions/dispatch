-- ============================================================
-- Dispatch MVP — Initial Schema
-- ============================================================

-- 1. Organizations
CREATE TABLE public.organizations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 2. Profiles (maps to auth.users)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 3. Organization Members (join table: users <-> orgs)
CREATE TABLE public.organization_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (organization_id, user_id)
);

-- 4. Prompts
CREATE TABLE public.prompts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  prompt_body text NOT NULL DEFAULT '',
  category text,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'archived')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 5. Context Assets
CREATE TABLE public.context_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  content text NOT NULL DEFAULT '',
  asset_type text,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'archived')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 6. Agents
CREATE TABLE public.agents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  purpose text,
  platform text,
  setup_notes text,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'archived')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 7. Workflows
CREATE TABLE public.workflows (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  steps jsonb DEFAULT '[]'::jsonb,
  tags text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'archived')),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- 8. Workflow <-> Prompts
CREATE TABLE public.workflow_prompts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id uuid NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  prompt_id uuid NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  UNIQUE (workflow_id, prompt_id)
);

-- 9. Workflow <-> Context Assets
CREATE TABLE public.workflow_context_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id uuid NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  context_asset_id uuid NOT NULL REFERENCES public.context_assets(id) ON DELETE CASCADE,
  UNIQUE (workflow_id, context_asset_id)
);

-- 10. Workflow <-> Agents
CREATE TABLE public.workflow_agents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id uuid NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  UNIQUE (workflow_id, agent_id)
);

-- ============================================================
-- Indexes
-- ============================================================

CREATE INDEX idx_org_members_user_id ON public.organization_members(user_id);
CREATE INDEX idx_org_members_org_id ON public.organization_members(organization_id);

CREATE INDEX idx_prompts_org_created ON public.prompts(organization_id, created_at DESC);
CREATE INDEX idx_prompts_tags ON public.prompts USING GIN(tags);

CREATE INDEX idx_context_assets_org_created ON public.context_assets(organization_id, created_at DESC);
CREATE INDEX idx_context_assets_tags ON public.context_assets USING GIN(tags);

CREATE INDEX idx_agents_org_created ON public.agents(organization_id, created_at DESC);
CREATE INDEX idx_agents_tags ON public.agents USING GIN(tags);

CREATE INDEX idx_workflows_org_created ON public.workflows(organization_id, created_at DESC);
CREATE INDEX idx_workflows_tags ON public.workflows USING GIN(tags);

CREATE INDEX idx_workflow_prompts_workflow ON public.workflow_prompts(workflow_id);
CREATE INDEX idx_workflow_context_assets_workflow ON public.workflow_context_assets(workflow_id);
CREATE INDEX idx_workflow_agents_workflow ON public.workflow_agents(workflow_id);

-- ============================================================
-- Helper function: get current user's org
-- ============================================================

CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS uuid AS $$
  SELECT organization_id
  FROM public.organization_members
  WHERE user_id = auth.uid()
  LIMIT 1;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.context_assets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.workflows
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- Profile creation trigger (on auth.users insert)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.context_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_context_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_agents ENABLE ROW LEVEL SECURITY;

-- Organizations: see/update own org only
CREATE POLICY "Users can view own org"
  ON public.organizations FOR SELECT
  USING (id = public.get_user_org_id());

CREATE POLICY "Owners can update org"
  ON public.organizations FOR UPDATE
  USING (id = public.get_user_org_id())
  WITH CHECK (id = public.get_user_org_id());

-- Profiles: see org members, update own
CREATE POLICY "Users can view org member profiles"
  ON public.profiles FOR SELECT
  USING (
    id = auth.uid()
    OR id IN (
      SELECT user_id FROM public.organization_members
      WHERE organization_id = public.get_user_org_id()
    )
  );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Organization Members: see own org members
CREATE POLICY "Users can view own org members"
  ON public.organization_members FOR SELECT
  USING (organization_id = public.get_user_org_id());

-- Core entities (prompts, context_assets, agents, workflows): full CRUD scoped to org
-- Prompts
CREATE POLICY "Org members can view prompts"
  ON public.prompts FOR SELECT
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can create prompts"
  ON public.prompts FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can update prompts"
  ON public.prompts FOR UPDATE
  USING (organization_id = public.get_user_org_id())
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can delete prompts"
  ON public.prompts FOR DELETE
  USING (organization_id = public.get_user_org_id());

-- Context Assets
CREATE POLICY "Org members can view context_assets"
  ON public.context_assets FOR SELECT
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can create context_assets"
  ON public.context_assets FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can update context_assets"
  ON public.context_assets FOR UPDATE
  USING (organization_id = public.get_user_org_id())
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can delete context_assets"
  ON public.context_assets FOR DELETE
  USING (organization_id = public.get_user_org_id());

-- Agents
CREATE POLICY "Org members can view agents"
  ON public.agents FOR SELECT
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can create agents"
  ON public.agents FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can update agents"
  ON public.agents FOR UPDATE
  USING (organization_id = public.get_user_org_id())
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can delete agents"
  ON public.agents FOR DELETE
  USING (organization_id = public.get_user_org_id());

-- Workflows
CREATE POLICY "Org members can view workflows"
  ON public.workflows FOR SELECT
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can create workflows"
  ON public.workflows FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can update workflows"
  ON public.workflows FOR UPDATE
  USING (organization_id = public.get_user_org_id())
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can delete workflows"
  ON public.workflows FOR DELETE
  USING (organization_id = public.get_user_org_id());

-- Join tables: scoped via workflow's org
CREATE POLICY "Org members can view workflow_prompts"
  ON public.workflow_prompts FOR SELECT
  USING (workflow_id IN (SELECT id FROM public.workflows WHERE organization_id = public.get_user_org_id()));

CREATE POLICY "Org members can manage workflow_prompts"
  ON public.workflow_prompts FOR INSERT
  WITH CHECK (workflow_id IN (SELECT id FROM public.workflows WHERE organization_id = public.get_user_org_id()));

CREATE POLICY "Org members can delete workflow_prompts"
  ON public.workflow_prompts FOR DELETE
  USING (workflow_id IN (SELECT id FROM public.workflows WHERE organization_id = public.get_user_org_id()));

CREATE POLICY "Org members can view workflow_context_assets"
  ON public.workflow_context_assets FOR SELECT
  USING (workflow_id IN (SELECT id FROM public.workflows WHERE organization_id = public.get_user_org_id()));

CREATE POLICY "Org members can manage workflow_context_assets"
  ON public.workflow_context_assets FOR INSERT
  WITH CHECK (workflow_id IN (SELECT id FROM public.workflows WHERE organization_id = public.get_user_org_id()));

CREATE POLICY "Org members can delete workflow_context_assets"
  ON public.workflow_context_assets FOR DELETE
  USING (workflow_id IN (SELECT id FROM public.workflows WHERE organization_id = public.get_user_org_id()));

CREATE POLICY "Org members can view workflow_agents"
  ON public.workflow_agents FOR SELECT
  USING (workflow_id IN (SELECT id FROM public.workflows WHERE organization_id = public.get_user_org_id()));

CREATE POLICY "Org members can manage workflow_agents"
  ON public.workflow_agents FOR INSERT
  WITH CHECK (workflow_id IN (SELECT id FROM public.workflows WHERE organization_id = public.get_user_org_id()));

CREATE POLICY "Org members can delete workflow_agents"
  ON public.workflow_agents FOR DELETE
  USING (workflow_id IN (SELECT id FROM public.workflows WHERE organization_id = public.get_user_org_id()));

-- ============================================================
-- Allow inserts during signup (before user has org membership)
-- ============================================================

-- Organizations: any authenticated user can create (for signup flow)
CREATE POLICY "Authenticated users can create org"
  ON public.organizations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Organization Members: any authenticated user can create their own membership
CREATE POLICY "Users can create own membership"
  ON public.organization_members FOR INSERT
  WITH CHECK (user_id = auth.uid());
