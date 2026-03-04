
-- Purchase requisitions table
CREATE TABLE public.purchase_requisitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text NOT NULL,
  req_id text NOT NULL DEFAULT '',
  material text NOT NULL,
  project_id uuid,
  project_name text NOT NULL DEFAULT '',
  quantity numeric NOT NULL DEFAULT 1,
  unit text NOT NULL DEFAULT 'un',
  supplier text NOT NULL DEFAULT '',
  unit_price numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  notes text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.purchase_requisitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view purchases in their tenant"
  ON public.purchase_requisitions FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can insert purchases in their tenant"
  ON public.purchase_requisitions FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can update purchases in their tenant"
  ON public.purchase_requisitions FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can delete purchases in their tenant"
  ON public.purchase_requisitions FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Enable realtime for purchase status changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.purchase_requisitions;

-- Templates table
CREATE TABLE public.templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'checklist',
  icon text DEFAULT 'FileText',
  usage_count integer NOT NULL DEFAULT 0,
  community boolean NOT NULL DEFAULT false,
  content jsonb DEFAULT '{}',
  created_by text DEFAULT '',
  created_by_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Users see own tenant templates + community templates
CREATE POLICY "Users can view own and community templates"
  ON public.templates FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()) OR community = true);

CREATE POLICY "Users can insert templates in their tenant"
  ON public.templates FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can update templates in their tenant"
  ON public.templates FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can delete templates in their tenant"
  ON public.templates FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

-- Purchase status change notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id text NOT NULL,
  user_id uuid,
  title text NOT NULL,
  message text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'info',
  read boolean NOT NULL DEFAULT false,
  reference_id uuid,
  reference_type text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view notifications in their tenant"
  ON public.notifications FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can insert notifications in their tenant"
  ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can update notifications in their tenant"
  ON public.notifications FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id(auth.uid()));

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
