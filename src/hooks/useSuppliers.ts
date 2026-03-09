import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Supplier {
  id: string;
  name: string;
  tenant_id: string;
  phone: string | null;
  email: string | null;
  notes: string | null;
  created_at: string;
}

export function useSuppliers() {
  const { profile } = useAuth();
  const tenantId = profile?.tenant_id;

  return useQuery({
    queryKey: ['suppliers', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');
      if (error) throw error;
      return (data || []) as Supplier[];
    },
    enabled: !!tenantId,
  });
}

export function useAddSupplier() {
  const qc = useQueryClient();
  const { profile } = useAuth();

  return useMutation({
    mutationFn: async (name: string) => {
      if (!profile?.tenant_id) throw new Error('No tenant');
      const { data, error } = await supabase
        .from('suppliers')
        .insert({ name, tenant_id: profile.tenant_id })
        .select()
        .single();
      if (error) throw error;
      return data as Supplier;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['suppliers'] }),
  });
}
