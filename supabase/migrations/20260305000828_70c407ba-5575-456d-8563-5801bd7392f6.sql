
-- Add portfolio branding columns to tenants
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS hero_headline text DEFAULT '';
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS hero_subheadline text DEFAULT '';
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS accent_color text DEFAULT '#c89b3c';
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS logo_url text DEFAULT '';

-- Add gallery images with captions to projects (stored as JSONB array)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS gallery jsonb DEFAULT '[]'::jsonb;
