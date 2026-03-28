-- ============================================================
-- Fix RLS policies that cause recursion / silent failures
-- Apply this if 00001 was already run with the old policies.
-- ============================================================

-- 1. Fix get_user_org_id: must be LANGUAGE sql (not plpgsql)
--    and remove SECURITY DEFINER so it respects RLS properly
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT organization_id
  FROM public.organization_members
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- 2. Fix organization_members SELECT policy to avoid recursion.
--    Old policy used: organization_id = get_user_org_id() which recursed
--    because get_user_org_id() reads organization_members.
DROP POLICY IF EXISTS "Users can view own org members" ON public.organization_members;
CREATE POLICY "Users can view own org members"
  ON public.organization_members FOR SELECT
  USING (user_id = auth.uid());
