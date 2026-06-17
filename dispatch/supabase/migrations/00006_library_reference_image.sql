-- ============================================================
-- Dispatch — Brand Library: optional reference image
-- ============================================================
-- Stores the *original* image a user worked from as reference, kept
-- separate from the generated result so the two are never confused.
-- Optional (nullable). The file lives in the same private `library`
-- bucket under {organization_id}/{uuid}.{ext}, so the existing storage
-- policies already cover it — no new policy needed.

ALTER TABLE public.library_images
  ADD COLUMN reference_storage_path text;
