
-- Blog posts table
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  author text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'GERAL',
  image_url text,
  read_time text NOT NULL DEFAULT '5 min de leitura',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read published posts
CREATE POLICY "Public can view published blog posts"
ON public.blog_posts FOR SELECT TO anon, authenticated
USING (published = true);

-- Super admins can manage all posts
CREATE POLICY "Super admins can manage blog posts"
ON public.blog_posts FOR ALL TO authenticated
USING (has_role(auth.uid(), 'super_admin'))
WITH CHECK (has_role(auth.uid(), 'super_admin'));

-- Suppliers table (tenant-scoped)
CREATE TABLE public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tenant_id text NOT NULL,
  phone text,
  email text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view suppliers in their tenant"
ON public.suppliers FOR SELECT TO authenticated
USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can insert suppliers in their tenant"
ON public.suppliers FOR INSERT TO authenticated
WITH CHECK (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can update suppliers in their tenant"
ON public.suppliers FOR UPDATE TO authenticated
USING (tenant_id = get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can delete suppliers in their tenant"
ON public.suppliers FOR DELETE TO authenticated
USING (tenant_id = get_user_tenant_id(auth.uid()));
