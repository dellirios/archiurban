import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, MoreHorizontal, Eye, RefreshCw, Ban,
  Building2, Filter, Loader2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useAdminData } from '@/hooks/useAdminData';
import { supabase } from '@/integrations/supabase/client';

const AdminTenants = () => {
  const { tenants, loading, refetch } = useAdminData();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', slug: '' });
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newTenant.name.trim()) {
      toast.error('Preencha o nome do escritório.');
      return;
    }
    setSaving(true);
    const slug = newTenant.slug.trim() || newTenant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const id = `tenant-${Date.now()}`;
    const { error } = await supabase.from('tenants').insert({ id, name: newTenant.name.trim(), slug } as any);
    setSaving(false);
    if (error) {
      toast.error('Erro ao criar escritório: ' + error.message);
      return;
    }
    toast.success(`Escritório "${newTenant.name}" criado!`);
    setAddOpen(false);
    setNewTenant({ name: '', slug: '' });
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> Escritórios
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {tenants.length} escritório{tenants.length !== 1 ? 's' : ''} registado{tenants.length !== 1 ? 's' : ''} na plataforma
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setAddOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> Adicionar Escritório
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar por nome..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Escritório</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Slug</th>
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
                  <td className="px-4 py-3 text-center text-sm">{t.activeUsers}</td>
                  <td className="px-4 py-3 text-center text-sm">{t.projectsCount}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(t.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => navigate(`/admin/tenants/${t.id}`)}>
                          <Eye className="w-3.5 h-3.5 mr-2" /> Ver Detalhes
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                    Nenhum escritório encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Tenant Modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Escritório</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Nome do Escritório</Label>
              <Input
                placeholder="Ex: Studio Y Arquitetura"
                value={newTenant.name}
                onChange={e => setNewTenant(p => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Slug (URL pública)</Label>
              <Input
                placeholder="ex: studio-y"
                value={newTenant.slug}
                onChange={e => setNewTenant(p => ({ ...p, slug: e.target.value }))}
              />
              <p className="text-[10px] text-muted-foreground">Será usado na URL /p/slug</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd} disabled={saving}>
              {saving ? 'Criando...' : 'Criar Escritório'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTenants;
