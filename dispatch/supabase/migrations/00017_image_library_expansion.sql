-- ============================================================
-- AI Foundation — Phase 6: Image Library expansion
-- Adds a status lifecycle + generation metadata to library images, and a
-- join table so images can connect to foundation assets.
-- ============================================================

-- 1. New columns. Existing images default to 'approved' (already in use).
ALTER TABLE public.library_images
  ADD COLUMN status text NOT NULL DEFAULT 'approved'
    CHECK (status IN ('draft', 'needs_review', 'approved', 'archived')),
  ADD COLUMN negative_prompt text,
  ADD COLUMN cref text,
  ADD COLUMN seed text,
  ADD COLUMN aspect_ratio text,
  ADD COLUMN usage_notes text;

CREATE INDEX idx_library_images_status ON public.library_images(status);

-- 2. Connect images to foundation assets (same join pattern as the others).
CREATE TABLE public.library_image_context_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  library_image_id uuid NOT NULL REFERENCES public.library_images(id) ON DELETE CASCADE,
  context_asset_id uuid NOT NULL REFERENCES public.context_assets(id) ON DELETE CASCADE,
  UNIQUE (library_image_id, context_asset_id)
);

ALTER TABLE public.library_image_context_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view library_image_context_assets"
  ON public.library_image_context_assets FOR SELECT
  USING (library_image_id IN (SELECT id FROM public.library_images WHERE organization_id = public.get_user_org_id()));
CREATE POLICY "Org members can manage library_image_context_assets"
  ON public.library_image_context_assets FOR INSERT
  WITH CHECK (library_image_id IN (SELECT id FROM public.library_images WHERE organization_id = public.get_user_org_id()));
CREATE POLICY "Org members can delete library_image_context_assets"
  ON public.library_image_context_assets FOR DELETE
  USING (library_image_id IN (SELECT id FROM public.library_images WHERE organization_id = public.get_user_org_id()));
