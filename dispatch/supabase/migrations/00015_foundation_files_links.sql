-- ============================================================
-- AI Foundation — Phase 4: file attachments + external links
-- Adds child tables so a foundation asset can carry multiple uploaded
-- files and multiple external links. Files reuse the existing private
-- `library` storage bucket (same precedent as governance attachments in
-- migration 00008), so no new bucket or storage policies are needed.
-- ============================================================

-- 1. Uploaded files (stored at {organization_id}/{uuid}.{ext} in `library`).
CREATE TABLE public.foundation_asset_files (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  foundation_asset_id uuid NOT NULL REFERENCES public.context_assets(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  file_name text NOT NULL,
  file_type text,
  file_size bigint,
  uploaded_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);
CREATE INDEX idx_foundation_asset_files_asset
  ON public.foundation_asset_files(foundation_asset_id);

-- 2. External links (Google Docs, Figma, Notion, web pages, etc.).
CREATE TABLE public.foundation_asset_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  foundation_asset_id uuid NOT NULL REFERENCES public.context_assets(id) ON DELETE CASCADE,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  url text NOT NULL,
  label text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);
CREATE INDEX idx_foundation_asset_links_asset
  ON public.foundation_asset_links(foundation_asset_id);

-- 3. RLS: org-scoped, same pattern as the other entities.
ALTER TABLE public.foundation_asset_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foundation_asset_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view foundation_asset_files"
  ON public.foundation_asset_files FOR SELECT
  USING (organization_id = public.get_user_org_id());
CREATE POLICY "Org members can create foundation_asset_files"
  ON public.foundation_asset_files FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id());
CREATE POLICY "Org members can delete foundation_asset_files"
  ON public.foundation_asset_files FOR DELETE
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can view foundation_asset_links"
  ON public.foundation_asset_links FOR SELECT
  USING (organization_id = public.get_user_org_id());
CREATE POLICY "Org members can create foundation_asset_links"
  ON public.foundation_asset_links FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id());
CREATE POLICY "Org members can delete foundation_asset_links"
  ON public.foundation_asset_links FOR DELETE
  USING (organization_id = public.get_user_org_id());
