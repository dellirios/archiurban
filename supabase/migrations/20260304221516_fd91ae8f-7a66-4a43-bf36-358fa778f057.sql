
-- Client invites table
CREATE TABLE public.client_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  client_name TEXT NOT NULL,
  project_ids TEXT[] DEFAULT '{}',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_at TIMESTAMPTZ
);

ALTER TABLE public.client_invites ENABLE ROW LEVEL SECURITY;

-- Architects can manage invites in their tenant
CREATE POLICY "Users can view invites in their tenant"
  ON public.client_invites FOR SELECT
  TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can insert invites in their tenant"
  ON public.client_invites FOR INSERT
  TO authenticated
  WITH CHECK (tenant_id = public.get_user_tenant_id(auth.uid()));

CREATE POLICY "Users can update invites in their tenant"
  ON public.client_invites FOR UPDATE
  TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

-- Update handle_new_user to check for pending invites
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _tenant_id TEXT;
  _invite RECORD;
BEGIN
  -- Check if there's a pending invite for this email
  SELECT INTO _invite tenant_id, id
  FROM public.client_invites
  WHERE email = NEW.email AND status = 'pending'
  ORDER BY created_at DESC
  LIMIT 1;

  IF _invite IS NOT NULL THEN
    _tenant_id := _invite.tenant_id;
    -- Mark invite as accepted
    UPDATE public.client_invites SET status = 'accepted', accepted_at = now() WHERE id = _invite.id;
  ELSE
    _tenant_id := COALESCE(NEW.raw_user_meta_data ->> 'tenant_id', 'tenant-1');
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, tenant_id, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', ''),
    _tenant_id,
    CASE WHEN _invite IS NOT NULL THEN 'client' ELSE 'architect' END
  );
  RETURN NEW;
END;
$$;
