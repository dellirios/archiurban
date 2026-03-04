
-- Fix: restrict tenant insert to users whose tenant_id matches (for self-registration)
DROP POLICY "Admins can insert tenants" ON public.tenants;
CREATE POLICY "Users can insert their own tenant"
  ON public.tenants FOR INSERT
  TO authenticated
  WITH CHECK (id = public.get_user_tenant_id(auth.uid()));
