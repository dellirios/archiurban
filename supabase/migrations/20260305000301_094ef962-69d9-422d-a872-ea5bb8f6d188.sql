
-- Add cover image column to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cover_image_url text DEFAULT '';

-- Create public bucket for portfolio cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-covers', 'portfolio-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to portfolio-covers
CREATE POLICY "Authenticated users can upload covers"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'portfolio-covers');

-- Allow authenticated users to update their covers
CREATE POLICY "Authenticated users can update covers"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'portfolio-covers');

-- Allow authenticated users to delete their covers
CREATE POLICY "Authenticated users can delete covers"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'portfolio-covers');

-- Allow public read access for portfolio covers
CREATE POLICY "Public can view portfolio covers"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'portfolio-covers');
