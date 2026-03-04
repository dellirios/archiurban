import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { purchaseStatusLabels, type PurchaseStatus } from '@/data/purchasesMockData';

// ── Types ──
export interface PurchaseRow {
  id: string;
  tenant_id: string;
  req_id: string;
  material: string;
  project_id: string | null;
  project_name: string;
  quantity: number;
  unit: string;
  supplier: string;
  unit_price: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface TemplateRow {
  id: string;
  tenant_id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  usage_count: number;
  community: boolean;
  content: any;
  created_by: string;
  created_by_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationRow {
  id: string;
  tenant_id: string;
  user_id: string | null;
  title: string;
  message: string;
  type: string;
  read: boolean;
  reference_id: string | null;
  reference_type: string;
  created_at: string;
}

// ── usePurchases ──
export function usePurchases() {
  const { profile } = useAuth();
  const [items, setItems] = useState<PurchaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const tenantId = profile?.tenant_id;

  const fetchItems = useCallback(async () => {
    if (!tenantId) { setItems([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('purchase_requisitions')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });
    setItems((data as PurchaseRow[] | null) ?? []);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  // Realtime with toast notifications on status change
  useEffect(() => {
    if (!tenantId) return;
    const channel = supabase
      .channel('purchases-rt')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'purchase_requisitions',
        filter: `tenant_id=eq.${tenantId}`,
      }, (payload) => {
        const oldStatus = (payload.old as any)?.status;
        const newRow = payload.new as PurchaseRow;
        if (oldStatus && oldStatus !== newRow.status) {
          const label = purchaseStatusLabels[newRow.status as PurchaseStatus] || newRow.status;
          toast.info(`${newRow.req_id} - ${newRow.material}`, {
            description: `Status atualizado para "${label}"`,
          });
          // Also insert notification record
          supabase.from('notifications').insert({
            tenant_id: tenantId,
            title: `Requisição ${newRow.req_id} atualizada`,
            message: `Status alterado para "${label}" — ${newRow.material}`,
            type: 'purchase_status',
            reference_id: newRow.id,
            reference_type: 'purchase',
          } as any).then(() => {});
        }
        fetchItems();
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'purchase_requisitions',
        filter: `tenant_id=eq.${tenantId}`,
      }, () => { fetchItems(); })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'purchase_requisitions',
        filter: `tenant_id=eq.${tenantId}`,
      }, () => { fetchItems(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tenantId, fetchItems]);

  const addPurchase = async (item: {
    material: string; project_name: string; quantity: number; unit: string; supplier: string; unit_price: number;
  }) => {
    if (!tenantId) return { error: new Error('No tenant') };
    const count = items.length + 1;
    const { error } = await supabase.from('purchase_requisitions').insert({
      tenant_id: tenantId,
      req_id: `REQ-${String(count).padStart(3, '0')}`,
      ...item,
    } as any);
    if (!error) await fetchItems();
    return { error };
  };

  const updatePurchase = async (id: string, data: Partial<PurchaseRow>) => {
    const { error } = await supabase.from('purchase_requisitions')
      .update({ ...data, updated_at: new Date().toISOString() } as any)
      .eq('id', id);
    if (!error) await fetchItems();
    return { error };
  };

  const deletePurchase = async (id: string) => {
    const { error } = await supabase.from('purchase_requisitions').delete().eq('id', id);
    if (!error) await fetchItems();
    return { error };
  };

  return { items, loading, addPurchase, updatePurchase, deletePurchase, refetch: fetchItems };
}

// ── useTemplates ──
export function useTemplates() {
  const { profile, user } = useAuth();
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const tenantId = profile?.tenant_id;

  const fetchTemplates = useCallback(async () => {
    if (!tenantId) { setTemplates([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false });
    setTemplates((data as TemplateRow[] | null) ?? []);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetchTemplates(); }, [fetchTemplates]);

  const addTemplate = async (t: { title: string; description: string; category: string; icon: string; content?: any }) => {
    if (!tenantId) return { error: new Error('No tenant') };
    const { content, ...rest } = t;
    const { error } = await supabase.from('templates').insert({
      tenant_id: tenantId,
      ...rest,
      content: content || {},
      created_by: profile?.full_name || user?.email || '',
      created_by_id: user?.id,
    } as any);
    if (!error) await fetchTemplates();
    return { error };
  };

  const updateTemplate = async (id: string, data: Partial<TemplateRow>) => {
    const { error } = await supabase.from('templates')
      .update({ ...data, updated_at: new Date().toISOString() } as any)
      .eq('id', id);
    if (!error) await fetchTemplates();
    return { error };
  };

  const deleteTemplate = async (id: string) => {
    const { error } = await supabase.from('templates').delete().eq('id', id);
    if (!error) await fetchTemplates();
    return { error };
  };

  const duplicateTemplate = async (source: TemplateRow) => {
    if (!tenantId) return { error: new Error('No tenant') };
    const { error } = await supabase.from('templates').insert({
      tenant_id: tenantId,
      title: source.title,
      description: source.description,
      category: source.category,
      icon: source.icon,
      content: source.content,
      community: false,
      created_by: profile?.full_name || user?.email || '',
      created_by_id: user?.id,
    } as any);
    if (!error) await fetchTemplates();
    return { error };
  };

  return { templates, loading, addTemplate, updateTemplate, deleteTemplate, duplicateTemplate, refetch: fetchTemplates };
}

// ── useNotifications ──
export function useNotifications() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const tenantId = profile?.tenant_id;

  const fetchNotifs = useCallback(async () => {
    if (!tenantId) { setNotifications([]); return; }
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(50);
    const rows = (data as NotificationRow[] | null) ?? [];
    setNotifications(rows);
    setUnreadCount(rows.filter(n => !n.read).length);
  }, [tenantId]);

  useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

  // Realtime
  useEffect(() => {
    if (!tenantId) return;
    const channel = supabase
      .channel('notifications-rt')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `tenant_id=eq.${tenantId}` }, () => { fetchNotifs(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [tenantId, fetchNotifs]);

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true } as any).eq('id', id);
    fetchNotifs();
  };

  const markAllRead = async () => {
    if (!tenantId) return;
    await supabase.from('notifications').update({ read: true } as any).eq('tenant_id', tenantId).eq('read', false);
    fetchNotifs();
  };

  return { notifications, unreadCount, markAsRead, markAllRead, refetch: fetchNotifs };
}
