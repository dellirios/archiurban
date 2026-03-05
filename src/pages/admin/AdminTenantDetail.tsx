import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, Users, FolderKanban, CreditCard,
  Calendar, Mail, Globe, TrendingUp, Ban, RefreshCw,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { mockTenants } from '@/data/adminMockData';

// Mock detailed data per tenant
const tenantMetrics = {
  projectsTotal: 24,
  projectsActive: 8,
  storageUsed: '2.4 GB',
  messagesMonth: 342,
  lastLogin: '2026-03-04T14:23:00',
};

const tenantProjects = [
  { id: 'P-001', name: 'Residência Vila Nova', status: 'Em andamento', progress: 72, client: 'João Silva' },
  { id: 'P-002', name: 'Escritório Corporate Tower', status: 'Em andamento', progress: 45, client: 'Empresa XYZ' },
  { id: 'P-003', name: 'Casa de Campo Itaipava', status: 'Concluído', progress: 100, client: 'Maria Santos' },
  { id: 'P-004', name: 'Apartamento Copacabana', status: 'Planejamento', progress: 10, client: 'Pedro Alves' },
  { id: 'P-005', name: 'Loft Industrial Barra', status: 'Em andamento', progress: 60, client: 'Ana Costa' },
];

const tenantActivity = [
  { date: '2026-03-04', action: 'Novo projeto criado', detail: 'Apartamento Copacabana' },
  { date: '2026-03-03', action: 'Arquivo enviado', detail: 'Planta Baixa v3.pdf' },
  { date: '2026-03-02', action: 'Lead adicionado ao CRM', detail: 'Empresa ABC' },
  { date: '2026-03-01', action: 'Membro adicionado à equipe', detail: 'carlos@email.com' },
  { date: '2026-02-28', action: 'Projeto concluído', detail: 'Casa de Campo Itaipava' },
];

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const statusColor = (s: string) => {
  if (s === 'Concluído') return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
  if (s === 'Em andamento') return 'bg-sky-500/10 text-sky-600 border-sky-500/20';
  return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
};

const AdminTenantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tenant = mockTenants.find(t => t.id === id);

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
        <Building2 className="w-10 h-10" />
        <p className="text-sm">Escritório não encontrado.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/tenants')}>
          Voltar
        </Button>
      </div>
    );
  }

  const planPrices: Record<string, number> = { Basic: 97, Pro: 197, Premium: 397 };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Back + Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" className="mt-0.5" onClick={() => navigate('/admin/tenants')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{tenant.name}</h1>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span className="font-mono">{tenant.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {tenant.email}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Desde {new Date(tenant.registeredAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <MoreHorizontal className="w-4 h-4" /> Ações
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => toast.info('Alterar plano')}>
              <RefreshCw className="w-3.5 h-3.5 mr-2" /> Alterar Plano
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => toast.warning(`${tenant.name} suspensa`)}>
              <Ban className="w-3.5 h-3.5 mr-2" /> Suspender Conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: 'Plano', value: tenant.plan, icon: CreditCard },
          { label: 'Estado', value: tenant.status, icon: Building2 },
          { label: 'Utilizadores', value: tenant.activeUsers.toString(), icon: Users },
          { label: 'Projetos', value: `${tenantMetrics.projectsActive} / ${tenantMetrics.projectsTotal}`, icon: FolderKanban },
          { label: 'Storage', value: tenantMetrics.storageUsed, icon: Globe },
          { label: 'Receita/mês', value: fmt(planPrices[tenant.plan] || 0), icon: TrendingUp },
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
        {/* Projects */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Projetos ({tenantMetrics.projectsTotal})</h3>
          </div>
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
                    <td className="px-4 py-2.5 text-muted-foreground">{p.client}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant="outline" className={`text-[10px] ${statusColor(p.status)}`}>{p.status}</Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right">{p.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Atividade Recente</h3>
          </div>
          <div className="divide-y divide-border">
            {tenantActivity.map((a, i) => (
              <div key={i} className="px-4 py-3 space-y-0.5">
                <p className="text-sm text-foreground">{a.action}</p>
                <p className="text-xs text-muted-foreground">{a.detail}</p>
                <p className="text-[10px] text-muted-foreground/60">{new Date(a.date).toLocaleDateString('pt-BR')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTenantDetail;
