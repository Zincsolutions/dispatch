-- ============================================================
-- Dispatch — Workflows & Loops
-- ============================================================
-- Extends workflows to support repeatable AI loops alongside standard
-- workflows. A loop is a workflow that continues until a success
-- condition is met. All new fields are optional except `type`.

ALTER TABLE public.workflows
  ADD COLUMN type text NOT NULL DEFAULT 'workflow',
  ADD COLUMN department text,
  ADD COLUMN category text,
  ADD COLUMN version text,
  ADD COLUMN risk_level text,
  ADD COLUMN estimated_run_time text,
  ADD COLUMN output_format text,
  ADD COLUMN success_criteria text,
  ADD COLUMN verification_method text,
  ADD COLUMN stop_condition text,
  ADD COLUMN escalation_condition text,
  ADD COLUMN last_reviewed date;

-- Workflow type (phase one uses workflow + loop; checklist/sop reserved).
ALTER TABLE public.workflows
  ADD CONSTRAINT workflows_type_check
  CHECK (type IN ('workflow', 'loop', 'checklist', 'sop'));

-- Widen the status lifecycle to match the rest of the app
-- (adds experimental + needs_review).
ALTER TABLE public.workflows DROP CONSTRAINT IF EXISTS workflows_status_check;
ALTER TABLE public.workflows ADD CONSTRAINT workflows_status_check
  CHECK (status IN ('draft', 'experimental', 'needs_review', 'approved', 'archived'));
