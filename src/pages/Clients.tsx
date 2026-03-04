import { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import InviteClientModal from '@/components/archi/InviteClientModal';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Clock, CheckCircle2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface InviteRow {
  id: string;
  email: string;
  client_name: string;
  status: string;
  created_at: string;
}

const Clients = () => {
  const { tenantClients } = useApp();
  const { profile } = useAuth();
  const [invites, setInvites] = useState<InviteRow[]>([]);

  const tenantId = profile?.tenant_id || 'tenant-1';

  const fetchInvites = async () => {
    const { data } = await supabase
      .from('client_invites')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });
    setInvites((data as InviteRow[] | null) ?? []);
  };

  useEffect(() => {
    fetchInvites();

    // Real-time subscription for invite status changes
    const channel = supabase
      .channel('client-invites-realtime')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'client_invites',
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload) => {
          const updated = payload.new as InviteRow;
          if (updated.status === 'accepted') {
            toast.success(`🎉 ${updated.client_name} aceitou o convite!`);
          }
          setInvites(prev =>
            prev.map(inv => inv.id === updated.id ? { ...inv, ...updated } : inv)
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'client_invites',
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload) => {
          const newInvite = payload.new as InviteRow;
          setInvites(prev => [newInvite, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tenantId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-1">{tenantClients.length} clientes cadastrados</p>
        </div>
        <InviteClientModal tenantId={tenantId} onSuccess={fetchInvites} />
      </div>

      {/* Existing clients */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          {tenantClients.map(client => (
            <div key={client.id} className="px-5 py-4 flex items-center gap-4 hover:bg-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
                {client.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{client.name}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {client.email}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {client.phone}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending invites */}
      {invites.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">Convites</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="divide-y divide-border">
              {invites.map(invite => (
                <div key={invite.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {invite.client_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{invite.client_name}</p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {invite.email}
                    </span>
                  </div>
                  <Badge variant="secondary" className={
                    invite.status === 'accepted'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-secondary text-muted-foreground'
                  }>
                    {invite.status === 'accepted' ? (
                      <><CheckCircle2 className="w-3 h-3 mr-1" /> Aceito</>
                    ) : (
                      <><Clock className="w-3 h-3 mr-1" /> Pendente</>
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
