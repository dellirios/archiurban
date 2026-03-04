import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// ── Types ──
export interface CrmLead {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  phone: string;
  origin: string;
  estimated_value: number;
  temperature: string;
  last_contact: string;
  stage: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectFileRow {
  id: string;
  tenant_id: string;
  project_id: string;
  name: string;
  file_type: string;
  file_size: number;
  folder: string;
  storage_path: string;
  uploaded_by: string;
  uploaded_by_id: string | null;
  created_at: string;
}

// ── useCrmLeads ──
export function useCrmLeads() {
  const { profile } = useAuth();
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState(true);
  const tenantId = profile?.tenant_id;

  const fetch = useCallback(async () => {
    if (!tenantId) { setLeads([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('crm_leads')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });
    setLeads((data as CrmLead[] | null) ?? []);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetch(); }, [fetch]);

  // realtime
  useEffect(() => {
    if (!tenantId) return;
    const channel = supabase
      .channel('crm-leads-rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'crm_leads', filter: `tenant_id=eq.${tenantId}` }, () => { fetch(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tenantId, fetch]);

  const addLead = async (lead: Omit<CrmLead, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('crm_leads').insert(lead as any);
    if (!error) await fetch();
    return { error };
  };

  const updateLead = async (id: string, data: Partial<CrmLead>) => {
    const { error } = await supabase.from('crm_leads').update({ ...data, updated_at: new Date().toISOString() } as any).eq('id', id);
    if (!error) await fetch();
    return { error };
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from('crm_leads').delete().eq('id', id);
    if (!error) await fetch();
    return { error };
  };

  return { leads, loading, refetch: fetch, addLead, updateLead, deleteLead };
}

// ── useProjectFiles ──
export function useProjectFiles(projectId: string | undefined) {
  const { profile, user } = useAuth();
  const [files, setFiles] = useState<ProjectFileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const tenantId = profile?.tenant_id;

  const fetch = useCallback(async () => {
    if (!projectId || !tenantId) { setFiles([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('project_files')
      .select('*')
      .eq('project_id', projectId)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });
    setFiles((data as ProjectFileRow[] | null) ?? []);
    setLoading(false);
  }, [projectId, tenantId]);

  useEffect(() => { fetch(); }, [fetch]);

  const detectFileType = (name: string): string => {
    const ext = name.split('.').pop()?.toLowerCase() || '';
    if (['pdf'].includes(ext)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext)) return 'image';
    if (['dwg', 'dxf'].includes(ext)) return 'dwg';
    if (['doc', 'docx'].includes(ext)) return 'doc';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'spreadsheet';
    return 'other';
  };

  const uploadFile = async (file: File, folder: string) => {
    if (!projectId || !tenantId || !user) return { error: new Error('Not authenticated') };
    setUploading(true);

    const storagePath = `${tenantId}/${projectId}/${folder}/${Date.now()}_${file.name}`;

    const { error: storageError } = await supabase.storage
      .from('project-files')
      .upload(storagePath, file);

    if (storageError) {
      setUploading(false);
      return { error: storageError };
    }

    const { error: dbError } = await supabase.from('project_files').insert({
      tenant_id: tenantId,
      project_id: projectId,
      name: file.name,
      file_type: detectFileType(file.name),
      file_size: file.size,
      folder,
      storage_path: storagePath,
      uploaded_by: profile?.full_name || user.email || 'Usuário',
      uploaded_by_id: user.id,
    } as any);

    setUploading(false);
    if (!dbError) await fetch();
    return { error: dbError };
  };

  const deleteFile = async (fileRow: ProjectFileRow) => {
    await supabase.storage.from('project-files').remove([fileRow.storage_path]);
    const { error } = await supabase.from('project_files').delete().eq('id', fileRow.id);
    if (!error) await fetch();
    return { error };
  };

  const getDownloadUrl = (storagePath: string) => {
    const { data } = supabase.storage.from('project-files').getPublicUrl(storagePath);
    return data.publicUrl;
  };

  const getSignedUrl = async (storagePath: string) => {
    const { data } = await supabase.storage.from('project-files').createSignedUrl(storagePath, 3600);
    return data?.signedUrl || '';
  };

  return { files, loading, uploading, refetch: fetch, uploadFile, deleteFile, getSignedUrl };
}
