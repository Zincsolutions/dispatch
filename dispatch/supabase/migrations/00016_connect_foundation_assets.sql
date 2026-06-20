-- ============================================================
-- AI Foundation — Phase 5: connect prompts & agents to foundation assets
-- Join tables mirroring workflow_context_assets (workflows already connect).
-- RLS derives the org via the parent row, same pattern as the workflow joins.
-- ============================================================

CREATE TABLE public.prompt_context_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id uuid NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  context_asset_id uuid NOT NULL REFERENCES public.context_assets(id) ON DELETE CASCADE,
  UNIQUE (prompt_id, context_asset_id)
);

CREATE TABLE public.agent_context_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id uuid NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  context_asset_id uuid NOT NULL REFERENCES public.context_assets(id) ON DELETE CASCADE,
  UNIQUE (agent_id, context_asset_id)
);

ALTER TABLE public.prompt_context_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_context_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view prompt_context_assets"
  ON public.prompt_context_assets FOR SELECT
  USING (prompt_id IN (SELECT id FROM public.prompts WHERE organization_id = public.get_user_org_id()));
CREATE POLICY "Org members can manage prompt_context_assets"
  ON public.prompt_context_assets FOR INSERT
  WITH CHECK (prompt_id IN (SELECT id FROM public.prompts WHERE organization_id = public.get_user_org_id()));
CREATE POLICY "Org members can delete prompt_context_assets"
  ON public.prompt_context_assets FOR DELETE
  USING (prompt_id IN (SELECT id FROM public.prompts WHERE organization_id = public.get_user_org_id()));

CREATE POLICY "Org members can view agent_context_assets"
  ON public.agent_context_assets FOR SELECT
  USING (agent_id IN (SELECT id FROM public.agents WHERE organization_id = public.get_user_org_id()));
CREATE POLICY "Org members can manage agent_context_assets"
  ON public.agent_context_assets FOR INSERT
  WITH CHECK (agent_id IN (SELECT id FROM public.agents WHERE organization_id = public.get_user_org_id()));
CREATE POLICY "Org members can delete agent_context_assets"
  ON public.agent_context_assets FOR DELETE
  USING (agent_id IN (SELECT id FROM public.agents WHERE organization_id = public.get_user_org_id()));
