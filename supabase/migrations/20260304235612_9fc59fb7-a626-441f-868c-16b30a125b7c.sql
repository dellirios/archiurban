
-- Add portfolio columns to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_portfolio_public boolean NOT NULL DEFAULT false;

-- Add portfolio profile columns to tenants table
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS slug text UNIQUE;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS bio text DEFAULT '';
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS instagram text DEFAULT '';
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS linkedin text DEFAULT '';
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS website text DEFAULT '';

-- Update slug for existing tenants based on name
UPDATE public.tenants SET slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) WHERE slug IS NULL;

-- Allow public read access for portfolio: tenants with slug
CREATE POLICY "Public can view tenant by slug"
  ON public.tenants FOR SELECT
  TO anon
  USING (slug IS NOT NULL);

-- Allow public to view portfolio-public projects
CREATE POLICY "Public can view portfolio projects"
  ON public.projects FOR SELECT
  TO anon
  USING (is_portfolio_public = true);

-- Allow tenants to update their own tenant record
CREATE POLICY "Users can update their tenant"
  ON public.tenants FOR UPDATE
  USING (id = get_user_tenant_id(auth.uid()))
  WITH CHECK (id = get_user_tenant_id(auth.uid()));
