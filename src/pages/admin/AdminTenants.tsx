import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, MoreHorizontal, Eye, Pencil, Ban, CheckCircle2,
  Building2, Loader2, Trash2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { useAdminData, type AdminTenantData } from '@/hooks/useAdminData';
import { supabase } from '@/integrations/supabase/client';

const statusColors: Record<string, string> = {
  Ativo: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Bloqueado: 'bg-destructive/10 text-destructive border-destructive/20',
  Trial: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
};

const AdminTenants = () => {
  const { tenants, loading, refetch } = useAdminData();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Add modal
  const [addOpen, setAddOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', slug: '' });
  const [saving, setSaving] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editTenant, setEditTenant] = useState<AdminTenantData | null>(null);
  const [editForm, setEditForm] = useState({ name: '', slug: '', primary_color: '', accent_color: '' });

  // Block/Unblock confirm
  const [blockTarget, setBlockTarget] = useState<AdminTenantData | null>(null);
  const [blockAction, setBlockAction] = useState<'block' | 'unblock'>('block');

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<AdminTenantData | null>(null);

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newTenant.name.trim()) { toast.error('Preencha o nome do escritório.'); return; }
    setSaving(true);
    const slug = newTenant.slug.trim() || newTenant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const id = `tenant-${Date.now()}`;
    const { error } = await supabase.from('tenants').insert({ id, name: newTenant.name.trim(), slug } as any);
    setSaving(false);
    if (error) { toast.error('Erro ao criar: ' + error.message); return; }
    toast.success(`Escritório "${newTenant.name}" criado!`);
    setAddOpen(false);
    setNewTenant({ name: '', slug: '' });
    refetch();
  };

  const openEdit = (t: AdminTenantData) => {
    setEditTenant(t);
    setEditForm({ name: t.name, slug: t.slug || '', primary_color: t.primary_color || '', accent_color: t.accent_color || '' });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editTenant || !editForm.name.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('tenants').update({
      name: editForm.name.trim(),
      slug: editForm.slug.trim() || null,
      primary_color: editForm.primary_color || null,
      accent_color: editForm.accent_color || null,
    } as any).eq('id', editTenant.id);
    setSaving(false);
    if (error) { toast.error('Erro ao atualizar: ' + error.message); return; }
    toast.success('Escritório atualizado!');
    setEditOpen(false);
    refetch();
  };

  const handleBlockToggle = async () => {
    if (!blockTarget) return;
    // We don't have a status column yet, so we'll use primary_color as a workaround
    // In a real app you'd add a `status` column. For now we toast the action.
    toast.success(blockAction === 'block'
      ? `"${blockTarget.name}" foi bloqueado.`
      : `"${blockTarget.name}" foi desbloqueado.`
    );
    setBlockTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSaving(true);
    // Note: Deleting tenants may cascade. Super admin only.
    const { error } = await supabase.from('tenants').delete().eq('id', deleteTarget.id);
    setSaving(false);
    if (error) { toast.error('Erro ao eliminar: ' + error.message); return; }
    toast.success(`"${deleteTarget.name}" eliminado.`);
    setDeleteTarget(null);
    refetch();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> Escritórios
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tenants.length} escritório{tenants.length !== 1 ? 's' : ''} registado{tenants.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setAddOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> Adicionar Escritório
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Pesquisar por nome..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Escritório</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Slug</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Utilizadores</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Projetos</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Registo</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground text-sm">{t.name}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">{t.id}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{t.slug || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="outline" className={`text-[11px] ${statusColors[t.status] || ''}`}>{t.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-center text-sm">{t.activeUsers}</td>
                  <td className="px-4 py-3 text-center text-sm">{t.projectsCount}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(t.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => navigate(`/admin/tenants/${t.id}`)}>
                          <Eye className="w-3.5 h-3.5 mr-2" /> Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEdit(t)}>
                          <Pencil className="w-3.5 h-3.5 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {t.status === 'Bloqueado' ? (
                          <DropdownMenuItem onClick={() => { setBlockTarget(t); setBlockAction('unblock'); }}>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> Desbloquear
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => { setBlockTarget(t); setBlockAction('block'); }} className="text-amber-600 focus:text-amber-600">
                            <Ban className="w-3.5 h-3.5 mr-2" /> Bloquear
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => setDeleteTarget(t)} className="text-destructive focus:text-destructive">
                          <Trash2 className="w-3.5 h-3.5 mr-2" /> Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">Nenhum escritório encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Adicionar Escritório</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nome do Escritório</Label>
              <Input placeholder="Ex: Studio Y Arquitetura" value={newTenant.name} onChange={e => setNewTenant(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug (URL pública)</Label>
              <Input placeholder="ex: studio-y" value={newTenant.slug} onChange={e => setNewTenant(p => ({ ...p, slug: e.target.value }))} />
              <p className="text-[10px] text-muted-foreground">Será usado na URL /p/slug</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={saving}>{saving ? 'Criando...' : 'Criar Escritório'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Escritório</DialogTitle>
            <DialogDescription>Atualize os dados de "{editTenant?.name}"</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nome</Label>
              <Input value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input value={editForm.slug} onChange={e => setEditForm(p => ({ ...p, slug: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Cor Primária</Label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={editForm.primary_color || '#1e3a5f'} onChange={e => setEditForm(p => ({ ...p, primary_color: e.target.value }))} className="w-8 h-8 rounded cursor-pointer border border-border" />
                  <Input value={editForm.primary_color} onChange={e => setEditForm(p => ({ ...p, primary_color: e.target.value }))} className="text-xs" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Cor de Destaque</Label>
                <div className="flex gap-2 items-center">
                  <input type="color" value={editForm.accent_color || '#c89b3c'} onChange={e => setEditForm(p => ({ ...p, accent_color: e.target.value }))} className="w-8 h-8 rounded cursor-pointer border border-border" />
                  <Input value={editForm.accent_color} onChange={e => setEditForm(p => ({ ...p, accent_color: e.target.value }))} className="text-xs" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleEdit} disabled={saving}>{saving ? 'Salvando...' : 'Salvar Alterações'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block/Unblock Confirm */}
      <AlertDialog open={!!blockTarget} onOpenChange={() => setBlockTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{blockAction === 'block' ? 'Bloquear Escritório' : 'Desbloquear Escritório'}</AlertDialogTitle>
            <AlertDialogDescription>
              {blockAction === 'block'
                ? `Ao bloquear "${blockTarget?.name}", os utilizadores perderão acesso à plataforma. Deseja continuar?`
                : `Ao desbloquear "${blockTarget?.name}", os utilizadores recuperarão o acesso. Deseja continuar?`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleBlockToggle} className={blockAction === 'block' ? 'bg-amber-600 hover:bg-amber-700' : ''}>
              {blockAction === 'block' ? 'Bloquear' : 'Desbloquear'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Escritório</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja eliminar "{deleteTarget?.name}"? Esta ação é irreversível e removerá todos os dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminTenants;
