import { useMemo } from 'react';
import {
  Building2, UserPlus, FolderKanban, ArrowUpRight, Loader2, TrendingUp, Activity,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from 'recharts';
import { useAdminData } from '@/hooks/useAdminData';

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

const STATUS_LABELS: Record<string, string> = {
  planning: 'Planejamento',
  execution: 'Execução',
  review: 'Revisão',
  completed: 'Finalizado',
};

const AdminDashboard = () => {
  const { tenants, profiles, projects, kpis, loading } = useAdminData();

  // Tenant registration growth by month (last 12 months)
  const tenantGrowthData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const now = new Date();
    const data: { month: string; tenants: number; users: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${months[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
      const tenantsCount = tenants.filter(t => {
        const td = new Date(t.created_at);
        return td.getMonth() === d.getMonth() && td.getFullYear() === d.getFullYear();
      }).length;
      const usersCount = profiles.filter(p => {
        const pd = new Date(p.created_at);
        return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
      }).length;
      data.push({ month: label, tenants: tenantsCount, users: usersCount });
    }
    return data;
  }, [tenants, profiles]);

  // Plan distribution
  const planDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    tenants.forEach(t => {
      const plan = t.plan || 'Basic';
      counts[plan] = (counts[plan] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [tenants]);

  // Project status distribution (all tenants)
  const projectStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });
    return Object.entries(counts).map(([key, value]) => ({
      name: STATUS_LABELS[key] || key,
      value,
    }));
  }, [projects]);

  // Top tenants by projects
  const topTenants = useMemo(() => {
    return [...tenants]
      .sort((a, b) => b.projectsCount - a.projectsCount)
      .slice(0, 6)
      .map(t => ({ name: t.name.length > 18 ? t.name.slice(0, 18) + '…' : t.name, projetos: t.projectsCount, usuarios: t.activeUsers }));
  }, [tenants]);

  // Recent activity (last 10 profiles created)
  const recentActivity = useMemo(() => {
    return [...profiles]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 8);
  }, [profiles]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const kpiCards = [
    { label: 'Escritórios', value: kpis.totalTenants, icon: Building2, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Utilizadores', value: kpis.totalUsers, icon: UserPlus, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { label: 'Projetos', value: kpis.totalProjects, icon: FolderKanban, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Novos este mês', value: kpis.newThisMonth, icon: ArrowUpRight, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Visão Geral</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Métricas globais da plataforma ArchiUrban</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map(card => (
          <div key={card.label} className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Tenant & User Growth Chart */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Crescimento Mensal</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Registros de escritórios e utilizadores nos últimos 12 meses</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={tenantGrowthData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradTenants" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="tenants" name="Escritórios" stroke="hsl(var(--chart-1))" fill="url(#gradTenants)" strokeWidth={2} />
              <Area type="monotone" dataKey="users" name="Utilizadores" stroke="hsl(var(--chart-2))" fill="url(#gradUsers)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Middle row: Plan distribution + Project status + Top tenants */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Plan Distribution */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Distribuição de Planos</h3>
          {planDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                  {planDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-16">Sem dados</p>
          )}
        </div>

        {/* Project Status */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Status dos Projetos</h3>
          {projectStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={projectStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                  {projectStatusData.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-16">Sem projetos</p>
          )}
        </div>

        {/* Top Tenants */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top Escritórios</h3>
          {topTenants.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topTenants} layout="vertical" margin={{ left: 0, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 9 }} width={100} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))', fontSize: 12 }} />
                <Bar dataKey="projetos" name="Projetos" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-16">Sem dados</p>
          )}
        </div>
      </div>

      {/* Bottom row: Recent tenants + Recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Tenants */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Escritórios Recentes</h3>
          </div>
          <div className="divide-y divide-border">
            {tenants.slice(0, 5).map(t => (
              <div key={t.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.activeUsers} utilizadores · {t.projectsCount} projetos</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(t.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))}
            {tenants.length === 0 && (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">Nenhum escritório registado.</p>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-border flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Atividade Recente</h3>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map(p => (
              <div key={p.id} className="px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                  {(p.full_name || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.full_name || 'Utilizador'}</p>
                  <p className="text-xs text-muted-foreground">{p.role === 'client' ? 'Cliente convidado' : 'Novo registo'}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(p.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="px-4 py-6 text-sm text-muted-foreground text-center">Nenhuma atividade recente.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
