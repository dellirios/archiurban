import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, Users, FolderKanban, CreditCard,
  Calendar, TrendingUp, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAdminData } from '@/hooks/useAdminData';

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const statusColor = (s: string) => {
  const map: Record<string, string> = {
    completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    in_progress: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
    planning: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  };
  return map[s] || 'bg-secondary text-secondary-foreground';
};

const statusLabel = (s: string) => {
  const map: Record<string, string> = {
    completed: 'Concluído',
    in_progress: 'Em andamento',
    planning: 'Planejamento',
  };
  return map[s] || s;
};

const AdminTenantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tenants, getProjectsForTenant, getUsersForTenant, loading } = useAdminData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const tenant = tenants.find(t => t.id === id);

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
        <Building2 className="w-10 h-10" />
        <p className="text-sm">Escritório não encontrado.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/tenants')}>Voltar</Button>
      </div>
    );
  }

  const tenantProjects = getProjectsForTenant(tenant.id);
  const tenantUsers = getUsersForTenant(tenant.id);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="sm" className="mt-0.5" onClick={() => navigate('/admin/tenants')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold text-foreground">{tenant.name}</h1>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
            <span className="font-mono">{tenant.id}</span>
            {tenant.slug && (
              <>
                <span>•</span>
                <span>/p/{tenant.slug}</span>
              </>
            )}
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Desde {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Utilizadores', value: tenantUsers.length.toString(), icon: Users },
          { label: 'Projetos', value: tenantProjects.length.toString(), icon: FolderKanban },
          { label: 'Concluídos', value: tenantProjects.filter(p => p.status === 'completed').length.toString(), icon: TrendingUp },
          { label: 'Em andamento', value: tenantProjects.filter(p => p.status === 'in_progress').length.toString(), icon: CreditCard },
        ].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <m.icon className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium uppercase tracking-wider">{m.label}</span>
            </div>
            <p className="text-lg font-bold text-foreground">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Projects Table */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Projetos ({tenantProjects.length})</h3>
          </div>
          {tenantProjects.length === 0 ? (
            <p className="px-4 py-8 text-sm text-muted-foreground text-center">Nenhum projeto.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Projeto</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Cliente</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-muted-foreground">Estado</th>
                    <th className="text-right px-4 py-2.5 text-xs font-medium text-muted-foreground">Progresso</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {tenantProjects.map(p => (
                    <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-foreground">{p.name}</td>
                      <td className="px-4 py-2.5 text-muted-foreground">{p.client_name || '—'}</td>
                      <td className="px-4 py-2.5">
                        <Badge variant="outline" className={`text-[10px] ${statusColor(p.status)}`}>
                          {statusLabel(p.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${p.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 text-right">{p.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Users */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Utilizadores ({tenantUsers.length})</h3>
          </div>
          {tenantUsers.length === 0 ? (
            <p className="px-4 py-8 text-sm text-muted-foreground text-center">Nenhum utilizador.</p>
          ) : (
            <div className="divide-y divide-border">
              {tenantUsers.map(u => (
                <div key={u.id} className="px-4 py-3 space-y-0.5">
                  <p className="text-sm text-foreground font-medium">{u.full_name || 'Sem nome'}</p>
                  <p className="text-xs text-muted-foreground">{u.role || 'architect'} · {new Date(u.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTenantDetail;
