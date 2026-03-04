import { FolderKanban, AlertTriangle, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import MetricCard from '@/components/archi/MetricCard';
import { useApp } from '@/contexts/AppContext';
import { statusLabels, statusColors, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

const STATUS_CHART_COLORS = ['#38bdf8', '#8b5cf6', '#f59e0b', '#10b981'];

const Dashboard = () => {
  const { tenantProjects, currentTenant, tenantClients, tenantTeam } = useApp();

  const activeProjects = tenantProjects.filter(p => p.status !== 'completed').length;
  const overdueProjects = tenantProjects.filter(p => {
    const end = new Date(p.endDate);
    return end < new Date() && p.status !== 'completed';
  }).length;
  const totalBudget = tenantProjects.filter(p => p.status !== 'completed').reduce((sum, p) => sum + p.budget, 0);

  // Monthly progress data
  const monthlyData = [
    { month: 'Jan', projetos: 2, concluidos: 1 },
    { month: 'Fev', projetos: 3, concluidos: 1 },
    { month: 'Mar', projetos: 4, concluidos: 2 },
    { month: 'Abr', projetos: 3, concluidos: 1 },
    { month: 'Mai', projetos: 5, concluidos: 2 },
    { month: 'Jun', projetos: 4, concluidos: 3 },
  ];

  // Status distribution
  const statusData = [
    { name: 'Planejamento', value: tenantProjects.filter(p => p.status === 'planning').length },
    { name: 'Execução', value: tenantProjects.filter(p => p.status === 'execution').length },
    { name: 'Revisão', value: tenantProjects.filter(p => p.status === 'review').length },
    { name: 'Finalizado', value: tenantProjects.filter(p => p.status === 'completed').length },
  ].filter(d => d.value > 0);

  const recentUpdates = [
    { id: '1', text: 'Fotos adicionadas ao projeto Residência Vila Nova', time: '2 horas atrás', icon: '📸' },
    { id: '2', text: 'Etapa "Alvenaria" concluída no Edifício Aurora', time: '5 horas atrás', icon: '✅' },
    { id: '3', text: 'Novo comentário de Mariana Costa', time: '1 dia atrás', icon: '💬' },
    { id: '4', text: 'Orçamento atualizado para Condomínio Horizonte', time: '2 dias atrás', icon: '📊' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Visão Geral</h1>
        <p className="text-sm text-muted-foreground mt-1">{currentTenant.name} — Painel de controle</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Projetos Ativos" value={activeProjects} icon={FolderKanban} trend={{ value: '+2 este mês', positive: true }} />
        <MetricCard title="Tarefas Atrasadas" value={overdueProjects} icon={AlertTriangle} trend={overdueProjects > 0 ? { value: 'Atenção', positive: false } : undefined} />
        <MetricCard title="Receita Prevista" value={formatCurrency(totalBudget)} icon={TrendingUp} subtitle="Em projetos ativos" />
        <MetricCard title="Clientes Ativos" value={tenantClients.length} icon={Clock} subtitle={`${tenantTeam.length} membros na equipe`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Progresso Mensal</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="projetos" name="Novos Projetos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="concluidos" name="Concluídos" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Distribuição por Status</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {statusData.map((_, index) => (
                    <Cell key={index} fill={STATUS_CHART_COLORS[index % STATUS_CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
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
