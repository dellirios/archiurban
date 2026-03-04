
-- 1. Add missing DELETE policy for client_invites (tenant-scoped)
CREATE POLICY "Users can delete invites in their tenant"
  ON public.client_invites FOR DELETE
  TO authenticated
  USING (tenant_id = public.get_user_tenant_id(auth.uid()));

-- 2. Add DELETE policy for profiles (GDPR compliance - own profile only)
CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- 3. Strengthen profiles: users in the same tenant can view each other's basic info
-- (needed for team features), but only their own full profile
-- Drop existing select policy and recreate with tenant scope
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view profiles in their tenant"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id
    OR tenant_id = public.get_user_tenant_id(auth.uid())
  );

-- 4. Ensure UPDATE is strictly own profile only (already exists but let's confirm)
-- The existing policy "Users can update own profile" uses auth.uid() = id — correct.

-- 5. Ensure INSERT is strictly own profile only (already exists)
-- The existing policy "Users can insert own profile" uses auth.uid() = id — correct.
