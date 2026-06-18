-- ============================================================
-- Dispatch — Prompts: optional sample output image
-- ============================================================
-- Lets a prompt carry an example of what it produces, so someone
-- browsing the prompt can see a sample result. Optional (nullable).
-- Reuses the existing private `library` bucket and its storage policies
-- (files under {organization_id}/{uuid}.{ext}), so no new bucket/policy
-- is needed — only this column.

ALTER TABLE public.prompts
  ADD COLUMN sample_output_path text;
