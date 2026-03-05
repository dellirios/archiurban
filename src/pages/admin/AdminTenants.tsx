import { useState } from 'react';
import {
  Search, Plus, MoreHorizontal, Eye, RefreshCw, Ban,
  Building2, Filter,
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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { mockTenants, type AdminTenant, type TenantStatus } from '@/data/adminMockData';

const statusBadge = (status: TenantStatus) => {
  const map: Record<TenantStatus, string> = {
    Ativo: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Bloqueado: 'bg-destructive/10 text-destructive border-destructive/20',
    Trial: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  };
  return (
    <Badge variant="outline" className={`text-[11px] font-medium ${map[status]}`}>
      {status}
    </Badge>
  );
};

const planBadge = (plan: string) => {
  const map: Record<string, string> = {
    Basic: 'bg-secondary text-secondary-foreground',
    Pro: 'bg-indigo-500/10 text-indigo-600',
    Premium: 'bg-amber-500/10 text-amber-700',
  };
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${map[plan] || ''}`}>
      {plan}
    </span>
  );
};

const AdminTenants = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [addOpen, setAddOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', email: '', plan: 'Basic' as string });

  const filtered = mockTenants.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleAdd = () => {
    if (!newTenant.name.trim() || !newTenant.email.trim()) {
      toast.error('Preencha todos os campos.');
      return;
    }
    toast.success(`Escritório "${newTenant.name}" adicionado com sucesso!`);
    setAddOpen(false);
    setNewTenant({ name: '', email: '', plan: 'Basic' });
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> Escritórios
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {mockTenants.length} escritórios registados na plataforma
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={() => setAddOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> Adicionar Escritório
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome ou ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-9 text-sm">
            <Filter className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Trial">Trial</SelectItem>
            <SelectItem value="Bloqueado">Bloqueado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Escritório</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Plano</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                <th className="text-center px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Utilizadores</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Registo</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map(t => (
                <tr key={t.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{t.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.email}</p>
                  </td>
                  <td className="px-4 py-3">{planBadge(t.plan)}</td>
                  <td className="px-4 py-3">{statusBadge(t.status)}</td>
                  <td className="px-4 py-3 text-center text-sm">{t.activeUsers}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(t.registeredAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={() => toast.info(`Detalhes de ${t.name}`)}>
                          <Eye className="w-3.5 h-3.5 mr-2" /> Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast.info(`Alterar plano de ${t.name}`)}>
                          <RefreshCw className="w-3.5 h-3.5 mr-2" /> Alterar Plano
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => toast.warning(`${t.name} foi suspensa.`)}
                        >
                          <Ban className="w-3.5 h-3.5 mr-2" /> Suspender Conta
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground text-sm">
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
              <Label>Email de Contacto</Label>
              <Input
                type="email"
                placeholder="admin@escritorio.com.br"
                value={newTenant.email}
                onChange={e => setNewTenant(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Plano</Label>
              <Select value={newTenant.plan} onValueChange={v => setNewTenant(p => ({ ...p, plan: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Pro">Pro</SelectItem>
                  <SelectItem value="Premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancelar</Button>
            <Button onClick={handleAdd}>Criar Escritório</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminTenants;
