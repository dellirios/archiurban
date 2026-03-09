import { useState, useEffect, useCallback } from 'react';
import {
  Users, Plus, Loader2, Trash2, Shield, MoreHorizontal, Mail,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AdminMember {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

const AdminTeam = () => {
  const [members, setMembers] = useState<AdminMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<AdminMember | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    // Get all super_admin user_ids
    const { data: roles } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'super_admin');

    if (!roles || roles.length === 0) {
      setMembers([]);
      setLoading(false);
      return;
    }

    const userIds = roles.map(r => r.user_id);

    // Get profiles for these users
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, created_at')
      .in('id', userIds);

    // We need emails from auth — we'll use the profiles + user_roles join
    // Since we can't query auth.users, we show profile info
    const enriched: AdminMember[] = (profiles || []).map(p => ({
      user_id: p.id,
      email: '', // Will be filled if available
      full_name: p.full_name,
      created_at: p.created_at,
    }));

    setMembers(enriched);
    setLoading(false);
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const handleAdd = async () => {
    if (!newEmail.trim()) { toast.error('Insira o email do novo administrador.'); return; }
    setSaving(true);

    // Find user by email — we need to search profiles or use a known user id
    // Since we can't query auth.users from the client, we'll ask the admin to ensure
    // the user is already registered, then add the role
    // For now, let's try to find by looking up if there's a profile with this email
    // Actually, profiles don't have email. We need to use a different approach.
    // We'll create an edge function or use signUp to invite.
    
    // Simplest approach: ask admin to provide user_id or use signInWithOtp to invite
    // For MVP, let's use Supabase admin API via edge function
    
    try {
      // Try to find user via invite mechanism — for now just add by email lookup
      // We'll use the auth admin API via edge function
      const { data, error } = await supabase.functions.invoke('admin-billing', {
        body: { action: 'lookup_user', email: newEmail.trim() },
      });
      
      if (error || !data?.userId) {
        // Fallback: try direct insert if admin knows the user_id
        toast.error('Utilizador não encontrado. Certifique-se que o email está registado na plataforma.');
        setSaving(false);
        return;
      }

      // Add super_admin role
      const { error: roleError } = await supabase.from('user_roles').insert({
        user_id: data.userId,
        role: 'super_admin',
      } as any);

      if (roleError) {
        if (roleError.message.includes('duplicate')) {
          toast.error('Este utilizador já é super administrador.');
        } else {
          toast.error('Erro: ' + roleError.message);
        }
        setSaving(false);
        return;
      }

      toast.success(`Super admin adicionado com sucesso!`);
      setAddOpen(false);
      setNewEmail('');
      fetchMembers();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao adicionar');
    }
    setSaving(false);
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    setSaving(true);
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', removeTarget.user_id)
      .eq('role', 'super_admin');
    setSaving(false);
    if (error) { toast.error('Erro: ' + error.message); setRemoveTarget(null); return; }
    toast.success('Papel de super admin removido.');
    setRemoveTarget(null);
    fetchMembers();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" /> Equipe ArchiUrban
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {members.length} super administrador{members.length !== 1 ? 'es' : ''}
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setAddOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> Adicionar Super Admin
        </Button>
      </div>

      {/* Members list */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          {members.map(m => (
            <div key={m.user_id} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {(m.full_name || '?')[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{m.full_name || 'Sem nome'}</p>
                  <p className="text-xs text-muted-foreground font-mono">{m.user_id.substring(0, 8)}…</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                  <Shield className="w-3 h-3 mr-1" /> Super Admin
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onClick={() => setRemoveTarget(m)}
                      className="text-destructive focus:text-destructive gap-2 text-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover Papel
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="px-5 py-12 text-sm text-muted-foreground text-center">Nenhum super administrador encontrado.</p>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Super Admin</DialogTitle>
            <DialogDescription>O utilizador deve já estar registado na plataforma.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Email do Utilizador</Label>
              <Input
                type="email"
                placeholder="utilizador@exemplo.com"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
              />
              <p className="text-[10px] text-muted-foreground">
                O papel super_admin será atribuído a este utilizador.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={saving} className="gap-1.5">
              {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Adicionando...</> : <><Shield className="w-3.5 h-3.5" /> Adicionar</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Confirm */}
      <AlertDialog open={!!removeTarget} onOpenChange={() => setRemoveTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Super Admin</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o papel de super administrador de "{removeTarget?.full_name || removeTarget?.user_id}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-destructive hover:bg-destructive/90">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTeam;
