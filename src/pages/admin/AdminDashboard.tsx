import {
  DollarSign, Building2, UserPlus, TrendingDown, TrendingUp, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { adminKpis, revenueGrowthData } from '@/data/adminMockData';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const kpiCards = [
  {
    label: 'MRR – Receita Mensal',
    value: formatCurrency(adminKpis.mrr),
    change: adminKpis.mrrGrowth,
    icon: DollarSign,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'Tenants Ativos',
    value: adminKpis.activeTenants.toString(),
    change: adminKpis.tenantGrowth,
    icon: Building2,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    label: 'Novos Registos (Mês)',
    value: adminKpis.newRegistrations.toString(),
    change: adminKpis.registrationGrowth,
    icon: UserPlus,
    color: 'text-sky-500',
    bg: 'bg-sky-500/10',
  },
  {
    label: 'Taxa de Churn',
    value: `${adminKpis.churnRate}%`,
    change: adminKpis.churnChange,
    icon: TrendingDown,
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
    invertColor: true,
  },
];

const AdminDashboard = () => (
  <div className="space-y-6 max-w-7xl">
    <div>
      <h1 className="text-xl font-semibold text-foreground">Visão Geral</h1>
      <p className="text-sm text-muted-foreground mt-0.5">Métricas globais da plataforma ArchiUrban</p>
    </div>

    {/* KPI Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpiCards.map(card => {
        const positive = card.invertColor ? card.change < 0 : card.change > 0;
        return (
          <div key={card.label} className="bg-card border border-border rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{card.label}</span>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground tracking-tight">{card.value}</p>
            <div className="flex items-center gap-1 text-xs">
              {positive ? (
                <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
              )}
              <span className={positive ? 'text-emerald-500' : 'text-destructive'}>
                {Math.abs(card.change)}%
              </span>
              <span className="text-muted-foreground">vs. mês anterior</span>
            </div>
          </div>
        );
      })}
    </div>

    {/* Chart */}
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-sm font-semibold text-foreground mb-1">Crescimento nos Últimos 12 Meses</h3>
      <p className="text-xs text-muted-foreground mb-6">Receita mensal (BRL) e utilizadores ativos</p>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueGrowthData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                fontSize: 12,
              }}
              formatter={(v: number, name: string) =>
                name === 'revenue' ? [formatCurrency(v), 'Receita'] : [v, 'Utilizadores']
              }
            />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#gradRevenue)" strokeWidth={2} />
            <Area yAxisId="right" type="monotone" dataKey="users" stroke="#6366f1" fill="url(#gradUsers)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
