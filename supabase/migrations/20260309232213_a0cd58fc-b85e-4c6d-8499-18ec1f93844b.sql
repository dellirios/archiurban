
-- Add status column to tenants
ALTER TABLE public.tenants 
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';

-- Create platform_settings table (single-row config)
CREATE TABLE public.platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform_name text NOT NULL DEFAULT 'ArchiUrban',
  support_email text NOT NULL DEFAULT '',
  default_language text NOT NULL DEFAULT 'pt-BR',
  maintenance_mode boolean NOT NULL DEFAULT false,
  allow_signups boolean NOT NULL DEFAULT true,
  require_email_verification boolean NOT NULL DEFAULT true,
  max_tenants_per_plan integer NOT NULL DEFAULT 100,
  default_trial_days integer NOT NULL DEFAULT 14,
  smtp_host text NOT NULL DEFAULT '',
  smtp_port text NOT NULL DEFAULT '587',
  notify_new_tenant boolean NOT NULL DEFAULT true,
  notify_new_payment boolean NOT NULL DEFAULT true,
  notify_churn boolean NOT NULL DEFAULT true,
  stripe_webhook_secret text NOT NULL DEFAULT '',
  api_rate_limit integer NOT NULL DEFAULT 100,
  custom_css text NOT NULL DEFAULT '',
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Only super admins can read/write platform settings
CREATE POLICY "Super admins can view platform settings"
  ON public.platform_settings FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can update platform settings"
  ON public.platform_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can insert platform settings"
  ON public.platform_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Insert default row
INSERT INTO public.platform_settings (id) VALUES (gen_random_uuid());
