ALTER TABLE public.platform_settings
  ADD COLUMN IF NOT EXISTS smtp_user text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS smtp_password text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS smtp_from_name text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS smtp_from_email text NOT NULL DEFAULT '';