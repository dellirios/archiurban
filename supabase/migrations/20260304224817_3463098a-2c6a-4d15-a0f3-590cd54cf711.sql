
-- ══════════════════════════════════════════════════
-- CRM Leads table
-- ══════════════════════════════════════════════════
CREATE TABLE public.crm_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text NOT NULL,
  name text NOT NULL,
  email text DEFAULT '',
  phone text DEFAULT '',
  origin text DEFAULT 'Direto',
  estimated_value numeric DEFAULT 0,
  temperature text NOT NULL DEFAULT 'warm',
  last_contact date DEFAULT CURRENT_DATE,
  stage text NOT NULL DEFAULT 'new',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view leads in their tenant" ON public.crm_leads
  FOR SELECT TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can insert leads in their tenant" ON public.crm_leads
  FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can update leads in their tenant" ON public.crm_leads
  FOR UPDATE TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can delete leads in their tenant" ON public.crm_leads
  FOR DELETE TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

-- ══════════════════════════════════════════════════
-- Project Files metadata table
-- ══════════════════════════════════════════════════
CREATE TABLE public.project_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text NOT NULL,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name text NOT NULL,
  file_type text NOT NULL DEFAULT 'other',
  file_size bigint DEFAULT 0,
  folder text NOT NULL DEFAULT 'plans',
  storage_path text NOT NULL,
  uploaded_by text NOT NULL DEFAULT '',
  uploaded_by_id uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view files in their tenant" ON public.project_files
  FOR SELECT TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can insert files in their tenant" ON public.project_files
  FOR INSERT TO authenticated
  WITH CHECK (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can delete files in their tenant" ON public.project_files
  FOR DELETE TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

-- ══════════════════════════════════════════════════
-- Storage bucket for project files
-- ══════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('project-files', 'project-files', false, 52428800);

-- Storage RLS: users can upload to their tenant folder
CREATE POLICY "Tenant upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'project-files'
    AND (storage.foldername(name))[1] = public.get_user_tenant_id(auth.uid())
  );

-- Storage RLS: users can view files in their tenant folder
CREATE POLICY "Tenant read" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'project-files'
    AND (storage.foldername(name))[1] = public.get_user_tenant_id(auth.uid())
  );

-- Storage RLS: users can delete files in their tenant folder
CREATE POLICY "Tenant delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'project-files'
    AND (storage.foldername(name))[1] = public.get_user_tenant_id(auth.uid())
  );

-- Enable realtime for CRM
ALTER PUBLICATION supabase_realtime ADD TABLE public.crm_leads;
