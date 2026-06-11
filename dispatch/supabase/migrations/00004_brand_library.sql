-- ============================================================
-- Dispatch — Brand Library (images + prompts + sref parameters)
-- ============================================================

-- 1. Collections: group images per brand / client / campaign.
CREATE TABLE public.image_collections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_image_collections_org ON public.image_collections(organization_id, created_at DESC);

-- 2. Library images: the generated image plus the recipe that made it.
CREATE TABLE public.library_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  collection_id uuid REFERENCES public.image_collections(id) ON DELETE SET NULL,
  storage_path text NOT NULL,
  title text,
  prompt text NOT NULL DEFAULT '',
  sref text,
  parameters text,
  tool text NOT NULL DEFAULT 'midjourney',
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_library_images_org_created ON public.library_images(organization_id, created_at DESC);
CREATE INDEX idx_library_images_collection ON public.library_images(collection_id);
CREATE INDEX idx_library_images_tags ON public.library_images USING GIN(tags);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.library_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 3. RLS: same org-scoped pattern as the other entities.
ALTER TABLE public.image_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view image_collections"
  ON public.image_collections FOR SELECT
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can create image_collections"
  ON public.image_collections FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can update image_collections"
  ON public.image_collections FOR UPDATE
  USING (organization_id = public.get_user_org_id())
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can delete image_collections"
  ON public.image_collections FOR DELETE
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can view library_images"
  ON public.library_images FOR SELECT
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can create library_images"
  ON public.library_images FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can update library_images"
  ON public.library_images FOR UPDATE
  USING (organization_id = public.get_user_org_id())
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can delete library_images"
  ON public.library_images FOR DELETE
  USING (organization_id = public.get_user_org_id());

-- 4. Private storage bucket. Files live under {organization_id}/{uuid}.{ext};
-- the folder prefix is what the storage policies scope on. Served to the
-- app via short-lived signed URLs.
INSERT INTO storage.buckets (id, name, public)
VALUES ('library', 'library', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Org members can upload library objects"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'library'
    AND (storage.foldername(name))[1] = public.get_user_org_id()::text
  );

CREATE POLICY "Org members can view library objects"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'library'
    AND (storage.foldername(name))[1] = public.get_user_org_id()::text
  );

CREATE POLICY "Org members can delete library objects"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'library'
    AND (storage.foldername(name))[1] = public.get_user_org_id()::text
  );

-- 5. Let usage_events track library image copies too.
ALTER TABLE public.usage_events DROP CONSTRAINT usage_events_entity_type_check;
ALTER TABLE public.usage_events ADD CONSTRAINT usage_events_entity_type_check
  CHECK (entity_type IN ('prompt', 'workflow', 'agent', 'context_asset', 'library_image'));
