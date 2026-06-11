-- ============================================================
-- Dispatch — Governance Hub (policies/SOPs + acknowledgments + tool registry)
-- ============================================================

-- 1. Documents: policies, SOPs, and guidelines.
CREATE TABLE public.documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  doc_type text NOT NULL DEFAULT 'policy' CHECK (doc_type IN ('policy', 'sop', 'guideline')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'archived')),
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_documents_org_created ON public.documents(organization_id, created_at DESC);
CREATE INDEX idx_documents_tags ON public.documents USING GIN(tags);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 2. Acknowledgments: who has read/accepted each document.
CREATE TABLE public.document_acknowledgments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id uuid NOT NULL REFERENCES public.documents(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  acknowledged_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (document_id, user_id)
);

CREATE INDEX idx_doc_acks_document ON public.document_acknowledgments(document_id);

-- 3. Tool registry: which AI tools the org uses, and the rules around them.
CREATE TABLE public.tool_registry (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'experimental' CHECK (status IN ('approved', 'experimental', 'not_allowed')),
  owner text,
  url text,
  rationale text,
  data_notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_tool_registry_org ON public.tool_registry(organization_id, created_at DESC);

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tool_registry
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- 4. RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_acknowledgments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_registry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Org members can view documents"
  ON public.documents FOR SELECT
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can create documents"
  ON public.documents FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can update documents"
  ON public.documents FOR UPDATE
  USING (organization_id = public.get_user_org_id())
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can delete documents"
  ON public.documents FOR DELETE
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can view document_acknowledgments"
  ON public.document_acknowledgments FOR SELECT
  USING (document_id IN (SELECT id FROM public.documents WHERE organization_id = public.get_user_org_id()));

CREATE POLICY "Members can acknowledge documents themselves"
  ON public.document_acknowledgments FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND document_id IN (SELECT id FROM public.documents WHERE organization_id = public.get_user_org_id())
  );

CREATE POLICY "Org members can view tool_registry"
  ON public.tool_registry FOR SELECT
  USING (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can create tool_registry"
  ON public.tool_registry FOR INSERT
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can update tool_registry"
  ON public.tool_registry FOR UPDATE
  USING (organization_id = public.get_user_org_id())
  WITH CHECK (organization_id = public.get_user_org_id());

CREATE POLICY "Org members can delete tool_registry"
  ON public.tool_registry FOR DELETE
  USING (organization_id = public.get_user_org_id());
