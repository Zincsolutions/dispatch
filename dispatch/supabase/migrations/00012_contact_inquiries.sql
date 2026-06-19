-- ============================================================
-- Dispatch — Contact inquiries (public contact / Enterprise lead form)
-- ============================================================
-- Submissions from the marketing /contact page. Rows are written
-- server-side via the service-role client (see lib/actions/contact.ts),
-- so RLS is enabled with NO public policies: the anon/authenticated
-- roles can neither read nor write this table directly. Only the service
-- role (which bypasses RLS) inserts, and the ZINC team reads via Supabase.

CREATE TABLE public.contact_inquiries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  company text,
  message text NOT NULL,
  plan_interest text,
  source text,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_contact_inquiries_created ON public.contact_inquiries(created_at DESC);

-- Lock the table down. No SELECT/INSERT/UPDATE/DELETE policies are created,
-- so RLS denies all direct access; the service role bypasses RLS for inserts.
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;
