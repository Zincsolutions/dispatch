-- ============================================================
-- Dispatch — Invitations + Usage Events
-- ============================================================

-- 1. Invitations: pending invites to join an organization.
-- Created by org owners; accepted server-side via the service role
-- (the invitee has no org membership yet, so RLS can't cover them).
CREATE TABLE public.invitations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  token uuid DEFAULT gen_random_uuid() NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'revoked')),
  invited_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz DEFAULT (now() + interval '14 days') NOT NULL
);

CREATE INDEX idx_invitations_org ON public.invitations(organization_id, created_at DESC);
CREATE INDEX idx_invitations_token ON public.invitations(token);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view invitations"
  ON public.invitations FOR SELECT
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Owners can create invitations"
  ON public.invitations FOR INSERT
  WITH CHECK (
    organization_id = public.get_user_org_id()
    AND EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = public.invitations.organization_id
        AND user_id = auth.uid()
        AND role = 'owner'
    )
  );

CREATE POLICY "Owners can update invitations"
  ON public.invitations FOR UPDATE
  USING (
    organization_id = public.get_user_org_id()
    AND EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = public.invitations.organization_id
        AND user_id = auth.uid()
        AND role = 'owner'
    )
  );

CREATE POLICY "Owners can delete invitations"
  ON public.invitations FOR DELETE
  USING (
    organization_id = public.get_user_org_id()
    AND EXISTS (
      SELECT 1 FROM public.organization_members
      WHERE organization_id = public.invitations.organization_id
        AND user_id = auth.uid()
        AND role = 'owner'
    )
  );

-- 2. Usage events: lightweight signals for "what's working" —
-- copies and click-to-run launches, attributed to entity + user.
CREATE TABLE public.usage_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entity_type text NOT NULL CHECK (entity_type IN ('prompt', 'workflow', 'agent', 'context_asset')),
  entity_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('copy', 'run_chatgpt', 'run_claude')),
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_usage_events_entity ON public.usage_events(organization_id, entity_type, entity_id);
CREATE INDEX idx_usage_events_org_created ON public.usage_events(organization_id, created_at DESC);

ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view usage_events"
  ON public.usage_events FOR SELECT
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can log own usage_events"
  ON public.usage_events FOR INSERT
  WITH CHECK (
    organization_id = public.get_user_org_id()
    AND user_id = auth.uid()
  );

-- 3. Security hardening: drop the signup-bootstrap INSERT policies.
-- The app performs org/membership bootstrap exclusively through the
-- service role client, so these anon-reachable policies are unused —
-- and "Users can create own membership" allowed any authenticated
-- user to insert themselves into ANY organization via the API.
DROP POLICY IF EXISTS "Users can create own membership" ON public.organization_members;
DROP POLICY IF EXISTS "Authenticated users can create org" ON public.organizations;
