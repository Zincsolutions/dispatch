-- ============================================================
-- Dispatch — Agents: governance metadata for the card view
-- ============================================================
-- Adds the fields the card-based Agents screen surfaces so each agent
-- reads like a governed, reusable AI worker. All optional (nullable).
--   department     e.g. 'marketing'
--   category       free-form sub-area, e.g. 'Website Strategy'
--   version        e.g. '1.2'
--   last_reviewed  date of last governance review
--   risk_level     'low' | 'medium' | 'high'
-- The expanded status values (experimental, needs_review) are enforced at
-- the application layer; the column stays plain text.

ALTER TABLE public.agents
  ADD COLUMN department text,
  ADD COLUMN category text,
  ADD COLUMN version text,
  ADD COLUMN last_reviewed date,
  ADD COLUMN risk_level text;
