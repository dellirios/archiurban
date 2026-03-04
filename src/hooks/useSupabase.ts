import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Project, Tenant, ChatMessage } from '@/lib/types';

// ── useProjects ──
export function useProjects() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const tenantId = profile?.tenant_id;

  const fetch = useCallback(async () => {
    if (!tenantId) { setProjects([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });
    setProjects((data as any[] ?? []).map(d => ({
      ...d,
      stages: d.stages ?? [],
      photos: d.photos ?? [],
      budget: Number(d.budget ?? 0),
    })));
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetch(); }, [fetch]);

  const addProject = async (p: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('projects').insert(p as any);
    if (!error) await fetch();
    return { error };
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    const { error } = await supabase.from('projects').update({ ...data, updated_at: new Date().toISOString() } as any).eq('id', id);
    if (!error) await fetch();
    return { error };
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) await fetch();
    return { error };
  };

  return { projects, loading, refetch: fetch, addProject, updateProject, deleteProject };
}

// ── useTenant ──
export function useTenant() {
  const { profile } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const tenantId = profile?.tenant_id;

  useEffect(() => {
    if (!tenantId) return;
    supabase.from('tenants').select('*').eq('id', tenantId).single()
      .then(({ data }) => setTenant(data as Tenant | null));
  }, [tenantId]);

  return { tenant, tenantId };
}

// ── useChat ──
export function useChat(projectId: string | undefined) {
  const { profile, user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const tenantId = profile?.tenant_id;

  useEffect(() => {
    if (!projectId || !tenantId) return;
    setLoading(true);
    supabase
      .from('chat_messages')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages((data as ChatMessage[]) ?? []);
        setLoading(false);
      });

    const channel = supabase
      .channel(`chat-${projectId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `project_id=eq.${projectId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as ChatMessage]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId, tenantId]);

  const sendMessage = async (content: string) => {
    if (!projectId || !tenantId || !user) return;
    await supabase.from('chat_messages').insert({
      project_id: projectId,
      tenant_id: tenantId,
      sender_id: user.id,
      sender_name: profile?.full_name || user.email || 'Usuário',
      sender_role: profile?.role || 'architect',
      content,
    } as any);
  };

  return { messages, loading, sendMessage };
}
