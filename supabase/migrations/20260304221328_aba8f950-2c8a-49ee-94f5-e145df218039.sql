
-- Update the trigger to set a default tenant_id on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _tenant_id TEXT;
BEGIN
  -- If invited by someone, inherit their tenant_id
  _tenant_id := NEW.raw_user_meta_data ->> 'tenant_id';
  
  -- Fallback to 'tenant-1' if not set
  IF _tenant_id IS NULL OR _tenant_id = '' THEN
    _tenant_id := 'tenant-1';
  END IF;

  INSERT INTO public.profiles (id, full_name, avatar_url, tenant_id)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NEW.raw_user_meta_data ->> 'picture', ''),
    _tenant_id
  );
  RETURN NEW;
END;
$$;
