import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AdminTenantData {
  id: string;
  name: string;
  slug: string | null;
  logo_url: string | null;
  created_at: string;
  primary_color: string | null;
  accent_color: string | null;
  // computed
  activeUsers: number;
  projectsCount: number;
  status: 'Ativo' | 'Bloqueado' | 'Trial';
  dbStatus: string;
  plan: 'Basic' | 'Pro' | 'Premium';
}

export function useAdminData() {
  const [tenants, setTenants] = useState<AdminTenantData[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [tenantsRes, profilesRes, projectsRes] = await Promise.all([
      supabase.from('tenants').select('*'),
      supabase.from('profiles').select('id, tenant_id, full_name, role, created_at'),
      supabase.from('projects').select('id, tenant_id, name, status, progress, client_name, created_at'),
    ]);

    const rawTenants = tenantsRes.data || [];
    const rawProfiles = profilesRes.data || [];
    const rawProjects = projectsRes.data || [];

    setProfiles(rawProfiles);
    setProjects(rawProjects);

    // Enrich tenants with computed fields
    const enriched: AdminTenantData[] = rawTenants.map(t => {
      const tenantProfiles = rawProfiles.filter(p => p.tenant_id === t.id);
      const tenantProjects = rawProjects.filter(p => p.tenant_id === t.id);
      return {
        id: t.id,
        name: t.name,
        slug: t.slug,
        logo_url: t.logo_url,
        created_at: t.created_at,
        primary_color: t.primary_color,
        accent_color: t.accent_color,
        activeUsers: tenantProfiles.length,
        projectsCount: tenantProjects.length,
        dbStatus: t.status || 'active',
        status: (t.status === 'blocked' ? 'Bloqueado' : t.status === 'trial' ? 'Trial' : 'Ativo') as const,
        plan: 'Pro' as const,
      };
    });

    setTenants(enriched);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // KPIs
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const newThisMonth = profiles.filter(p => {
    const d = new Date(p.created_at);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const kpis = {
    totalTenants: tenants.length,
    totalUsers: profiles.length,
    totalProjects: projects.length,
    newThisMonth,
  };

  // Get projects for a specific tenant
  const getProjectsForTenant = (tenantId: string) =>
    projects.filter(p => p.tenant_id === tenantId);

  const getUsersForTenant = (tenantId: string) =>
    profiles.filter(p => p.tenant_id === tenantId);

  return {
    tenants, profiles, projects, loading, kpis,
    getProjectsForTenant, getUsersForTenant,
    refetch: fetchAll,
  };
}
