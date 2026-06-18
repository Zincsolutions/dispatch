-- ============================================================
-- Dispatch — Agents: widen status CHECK to the governance lifecycle
-- ============================================================
-- The original constraint only allowed draft/approved/archived. The
-- card-view work added 'experimental' and 'needs_review' at the app
-- layer (AGENT_STATUSES); this brings the DB constraint in line so
-- those statuses can be saved.

ALTER TABLE public.agents DROP CONSTRAINT IF EXISTS agents_status_check;
ALTER TABLE public.agents ADD CONSTRAINT agents_status_check
  CHECK (status IN ('draft', 'experimental', 'needs_review', 'approved', 'archived'));
