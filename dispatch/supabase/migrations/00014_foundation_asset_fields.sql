-- ============================================================
-- AI Foundation — Phase 2: structured foundation asset fields
-- Expands context_assets (the AI Foundation table) with the foundation
-- category, owner + approval metadata, a notes field, and an expanded
-- status set. Table name is kept as context_assets for now.
-- ============================================================

-- 1. Foundation category (the six AI Foundation categories). Nullable so
-- existing rows stay valid; new/edited assets select one in the form.
ALTER TABLE public.context_assets ADD COLUMN category text
  CHECK (category IS NULL OR category IN (
    'brand_identity',
    'voice_messaging',
    'products_services',
    'customers_personas',
    'company_knowledge',
    'examples_reference'
  ));

-- 2. Notes + owner + approval metadata.
ALTER TABLE public.context_assets ADD COLUMN notes text;
ALTER TABLE public.context_assets ADD COLUMN owner_user_id uuid
  REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.context_assets ADD COLUMN approved_by uuid
  REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.context_assets ADD COLUMN approved_at timestamptz;

-- 3. Expand the status set to include 'needs_review'.
ALTER TABLE public.context_assets DROP CONSTRAINT context_assets_status_check;
ALTER TABLE public.context_assets ADD CONSTRAINT context_assets_status_check
  CHECK (status IN ('draft', 'needs_review', 'approved', 'archived'));

-- 4. Backfill owner = creator for existing rows.
UPDATE public.context_assets SET owner_user_id = created_by WHERE owner_user_id IS NULL;

-- 5. Index for category filtering.
CREATE INDEX idx_context_assets_category ON public.context_assets(category);
