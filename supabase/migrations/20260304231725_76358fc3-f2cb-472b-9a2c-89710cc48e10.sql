
-- Lead interactions / notes history
CREATE TABLE public.lead_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.crm_leads(id) ON DELETE CASCADE,
  tenant_id text NOT NULL,
  type text NOT NULL DEFAULT 'note',
  content text NOT NULL DEFAULT '',
  created_by text NOT NULL DEFAULT '',
  created_by_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view interactions in their tenant"
  ON public.lead_interactions FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can insert interactions in their tenant"
  ON public.lead_interactions FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can delete interactions in their tenant"
  ON public.lead_interactions FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));
