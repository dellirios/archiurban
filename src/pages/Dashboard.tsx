import { FolderKanban, AlertTriangle, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';
import MetricCard from '@/components/archi/MetricCard';
import { useApp } from '@/contexts/AppContext';
import { statusLabels, statusColors, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { tenantProjects, currentTenant, tenantClients, tenantTeam } = useApp();

  const activeProjects = tenantProjects.filter(p => p.status !== 'completed').length;
  const overdueProjects = tenantProjects.filter(p => {
    const end = new Date(p.endDate);
    return end < new Date() && p.status !== 'completed';
  }).length;
  const totalBudget = tenantProjects.filter(p => p.status !== 'completed').reduce((sum, p) => sum + p.budget, 0);

  const recentUpdates = [
    { id: '1', text: 'Fotos adicionadas ao projeto Residência Vila Nova', time: '2 horas atrás', icon: '📸' },
    { id: '2', text: 'Etapa "Alvenaria" concluída no Edifício Aurora', time: '5 horas atrás', icon: '✅' },
    { id: '3', text: 'Novo comentário de Mariana Costa', time: '1 dia atrás', icon: '💬' },
    { id: '4', text: 'Orçamento atualizado para Condomínio Horizonte', time: '2 dias atrás', icon: '📊' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Visão Geral</h1>
        <p className="text-sm text-muted-foreground mt-1">{currentTenant.name} — Painel de controle</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Projetos Ativos"
          value={activeProjects}
          icon={FolderKanban}
          trend={{ value: '+2 este mês', positive: true }}
        />
        <MetricCard
          title="Tarefas Atrasadas"
          value={overdueProjects}
          icon={AlertTriangle}
          trend={overdueProjects > 0 ? { value: 'Atenção', positive: false } : undefined}
        />
        <MetricCard
          title="Receita Prevista"
          value={formatCurrency(totalBudget)}
          icon={TrendingUp}
          subtitle="Em projetos ativos"
        />
        <MetricCard
          title="Clientes Ativos"
          value={tenantClients.length}
          icon={Clock}
          subtitle={`${tenantTeam.length} membros na equipe`}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Projects Summary */}
        <div className="xl:col-span-2 bg-card border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Projetos em Andamento</h2>
            <a href="/app/projects" className="text-xs text-primary hover:underline flex items-center gap-1">
              Ver todos <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
          <div className="divide-y divide-border">
            {tenantProjects.filter(p => p.status !== 'completed').slice(0, 4).map(project => (
              <div key={project.id} className="px-5 py-4 flex items-center gap-4 hover:bg-accent/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{project.clientName}</p>
                </div>
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0', statusColors[project.status])}>
                  {statusLabels[project.status]}
                </span>
                <div className="w-24 flex items-center gap-2 flex-shrink-0">
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium w-8 text-right">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Últimas Atualizações</h2>
          </div>
          <div className="divide-y divide-border">
            {recentUpdates.map(update => (
              <div key={update.id} className="px-5 py-3.5 hover:bg-accent/30 transition-colors">
                <div className="flex gap-3">
                  <span className="text-lg flex-shrink-0">{update.icon}</span>
                  <div>
                    <p className="text-sm text-foreground">{update.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">{update.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
