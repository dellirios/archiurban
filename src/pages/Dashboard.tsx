import { FolderKanban, AlertTriangle, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import MetricCard from '@/components/archi/MetricCard';
import { useApp } from '@/contexts/AppContext';
import { statusLabels, statusColors, formatCurrency } from '@/lib/types';
import { cn } from '@/lib/utils';

const STATUS_CHART_COLORS = ['#38bdf8', '#8b5cf6', '#f59e0b', '#10b981'];

const Dashboard = () => {
  const { projects, currentTenant } = useApp();

  const activeProjects = projects.filter(p => p.status !== 'completed').length;
  const overdueProjects = projects.filter(p => {
    const end = p.end_date ? new Date(p.end_date) : null;
    return end && end < new Date() && p.status !== 'completed';
  }).length;
  const totalBudget = projects.filter(p => p.status !== 'completed').reduce((sum, p) => sum + p.budget, 0);

  const statusData = [
    { name: 'Planejamento', value: projects.filter(p => p.status === 'planning').length },
    { name: 'Execução', value: projects.filter(p => p.status === 'execution').length },
    { name: 'Revisão', value: projects.filter(p => p.status === 'review').length },
    { name: 'Finalizado', value: projects.filter(p => p.status === 'completed').length },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Visão Geral</h1>
        <p className="text-sm text-muted-foreground mt-1">{currentTenant.name} — Painel de controle</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="Projetos Ativos" value={activeProjects} icon={FolderKanban} />
        <MetricCard title="Tarefas Atrasadas" value={overdueProjects} icon={AlertTriangle} trend={overdueProjects > 0 ? { value: 'Atenção', positive: false } : undefined} />
        <MetricCard title="Receita Prevista" value={formatCurrency(totalBudget)} icon={TrendingUp} subtitle="Em projetos ativos" />
        <MetricCard title="Total Projetos" value={projects.length} icon={Clock} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Distribuição por Status</h2>
          <div className="h-64">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                    {statusData.map((_, index) => (<Cell key={index} fill={STATUS_CHART_COLORS[index % STATUS_CHART_COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Nenhum projeto cadastrado</div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Projetos em Andamento</h2>
            <a href="/app/projects" className="text-xs text-primary hover:underline flex items-center gap-1">Ver todos <ArrowUpRight className="w-3 h-3" /></a>
          </div>
          <div className="divide-y divide-border">
            {projects.filter(p => p.status !== 'completed').slice(0, 5).map(project => (
              <div key={project.id} className="px-5 py-4 flex items-center gap-4 hover:bg-accent/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{project.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{project.client_name}</p>
                </div>
                <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0', statusColors[project.status])}>{statusLabels[project.status]}</span>
                <div className="w-24 flex items-center gap-2 flex-shrink-0">
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium w-8 text-right">{project.progress}%</span>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="px-5 py-4 text-sm text-muted-foreground">Nenhum projeto cadastrado</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
