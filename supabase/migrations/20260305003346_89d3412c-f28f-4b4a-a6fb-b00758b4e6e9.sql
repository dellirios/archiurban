
-- Allow super_admins to read ALL tenants
CREATE POLICY "Super admins can view all tenants"
ON public.tenants
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Allow super_admins to read ALL profiles
CREATE POLICY "Super admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Allow super_admins to read ALL projects
CREATE POLICY "Super admins can view all projects"
ON public.projects
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Allow super_admins to update any tenant
CREATE POLICY "Super admins can update all tenants"
ON public.tenants
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'))
WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
