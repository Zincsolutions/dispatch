-- ============================================================
-- Phase 3: per-organization plan + billing fields
-- Tracks which plan each org is on (no hard enforcement yet) and holds
-- the Stripe identifiers the billing scaffold (next phase) will populate.
-- ============================================================

ALTER TABLE public.organizations
  ADD COLUMN plan text NOT NULL DEFAULT 'personal'
    CHECK (plan IN ('personal', 'starter', 'team', 'enterprise')),
  ADD COLUMN plan_status text,
  ADD COLUMN stripe_customer_id text,
  ADD COLUMN stripe_subscription_id text;

-- Existing organizations are real customers — grandfather them onto a safe
-- paid tier so nothing they have today reads as over-limit.
UPDATE public.organizations
  SET plan = 'team', plan_status = 'active'
  WHERE plan = 'personal';
