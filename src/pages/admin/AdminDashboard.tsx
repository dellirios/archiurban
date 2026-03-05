import { useEffect, useState } from 'react';
import {
  DollarSign, Building2, UserPlus, FolderKanban, ArrowUpRight, Loader2,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAdminData } from '@/hooks/useAdminData';
import { revenueGrowthData } from '@/data/adminMockData';

const formatCurrency = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const AdminDashboard = () => {
  const { tenants, kpis, loading } = useAdminData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const kpiCards = [
    {
      label: 'Escritórios Registados',
      value: kpis.totalTenants.toString(),
      icon: Building2,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
    },
    {
      label: 'Utilizadores Totais',
      value: kpis.totalUsers.toString(),
      icon: UserPlus,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10',
    },
    {
      label: 'Projetos na Plataforma',
      value: kpis.totalProjects.toString(),
      icon: FolderKanban,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      label: 'Novos este Mês',
      value: kpis.newThisMonth.toString(),
      icon: ArrowUpRight,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
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

      {/* Recent Tenants */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
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

      {/* Revenue Chart (mock for now — will be real with Stripe) */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-1">Crescimento (Projeção)</h3>
        <p className="text-xs text-muted-foreground mb-6">Dados de receita serão integrados via Stripe</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueGrowthData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.5rem',
                  fontSize: 12,
                }}
                formatter={(v: number) => [formatCurrency(v), 'Receita']}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" fill="url(#gradRevenue)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
