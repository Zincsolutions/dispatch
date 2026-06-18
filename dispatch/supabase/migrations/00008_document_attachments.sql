-- ============================================================
-- Dispatch — Governance documents: file attachment (PDF / docs)
-- ============================================================
-- Lets a policy / SOP / guideline carry an uploaded file (e.g. a PDF)
-- in addition to or instead of inline text. Optional (nullable).
-- attachment_name preserves the original file name for display/download.
-- Reuses the existing private `library` bucket and its storage policies
-- (files under {organization_id}/{uuid}.{ext}), so no new bucket/policy
-- is needed — only these columns.

ALTER TABLE public.documents
  ADD COLUMN attachment_path text,
  ADD COLUMN attachment_name text;
