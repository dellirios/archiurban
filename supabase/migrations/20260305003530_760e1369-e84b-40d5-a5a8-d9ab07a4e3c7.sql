
-- Allow super_admins to insert tenants
CREATE POLICY "Super admins can insert tenants"
ON public.tenants
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
