import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function usePortfolio() {
  const { profile } = useAuth();
  const tenantId = profile?.tenant_id;

  const [projects, setProjects] = useState<any[]>([]);
  const [tenantProfile, setTenantProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!tenantId) { setLoading(false); return; }
    setLoading(true);

    const [{ data: projData }, { data: tenData }] = await Promise.all([
      supabase
        .from('projects')
        .select('id, name, description, client_name, status, photos, is_portfolio_public')
        .eq('tenant_id', tenantId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false }),
      supabase
        .from('tenants')
        .select('*')
        .eq('id', tenantId)
        .maybeSingle(),
    ]);

    setProjects(projData || []);
    setTenantProfile(tenData);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleProjectPublic = async (projectId: string, isPublic: boolean) => {
    await supabase.from('projects').update({ is_portfolio_public: isPublic } as any).eq('id', projectId);
    await fetchData();
  };

  const updateTenantProfile = async (data: { bio?: string; instagram?: string; linkedin?: string; website?: string }) => {
    if (!tenantId) return;
    await supabase.from('tenants').update(data as any).eq('id', tenantId);
    await fetchData();
  };

  return { projects, tenantProfile, loading, toggleProjectPublic, updateTenantProfile, refetch: fetchData };
}
