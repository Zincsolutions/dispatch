-- Performance indexes for the most common list/filter/review queries.
--
-- Two themes from the latency audit:
--   1. List pages and the review queue filter by status within an org, but
--      only library_images had a status index. Add composite
--      (organization_id, status) indexes so the planner can use both the
--      RLS org predicate and the status filter together.
--   2. The context-asset join tables had no index on the reverse (child) FK
--      column, so cascade deletes and reverse lookups did sequential scans.
--
-- All statements are idempotent (IF NOT EXISTS) and additive (no data change).

-- 1. Composite (organization_id, status) indexes -----------------------------
CREATE INDEX IF NOT EXISTS idx_prompts_org_status
  ON public.prompts (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_context_assets_org_status
  ON public.context_assets (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_agents_org_status
  ON public.agents (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_workflows_org_status
  ON public.workflows (organization_id, status);

CREATE INDEX IF NOT EXISTS idx_documents_org_status
  ON public.documents (organization_id, status);

-- 2. Reverse-FK (context_asset_id) indexes on join tables --------------------
CREATE INDEX IF NOT EXISTS idx_prompt_ctx_assets_ctx
  ON public.prompt_context_assets (context_asset_id);

CREATE INDEX IF NOT EXISTS idx_agent_ctx_assets_ctx
  ON public.agent_context_assets (context_asset_id);

CREATE INDEX IF NOT EXISTS idx_workflow_ctx_assets_ctx
  ON public.workflow_context_assets (context_asset_id);

CREATE INDEX IF NOT EXISTS idx_library_image_ctx_assets_ctx
  ON public.library_image_context_assets (context_asset_id);

-- workflow_agents reverse side (agent deletes / first-agent lookups)
CREATE INDEX IF NOT EXISTS idx_workflow_agents_agent
  ON public.workflow_agents (agent_id);

-- library_image_context_assets has no by-parent index for the
-- delete-then-reinsert churn on image save.
CREATE INDEX IF NOT EXISTS idx_library_image_ctx_assets_img
  ON public.library_image_context_assets (library_image_id);
