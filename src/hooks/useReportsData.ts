import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useReportsData() {
  const { profile } = useAuth();
  const tenantId = profile?.tenant_id;

  const [projects, setProjects] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!tenantId) { setLoading(false); return; }
    setLoading(true);
    const [p, l, pr] = await Promise.all([
      supabase.from('projects').select('*').eq('tenant_id', tenantId),
      supabase.from('crm_leads').select('*').eq('tenant_id', tenantId),
      supabase.from('purchase_requisitions').select('*').eq('tenant_id', tenantId),
    ]);
    setProjects(p.data || []);
    setLeads(l.data || []);
    setPurchases(pr.data || []);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // KPIs
  const kpis = useMemo(() => {
    const totalBudget = projects.reduce((s, p) => s + (Number(p.budget) || 0), 0);
    const totalPurchases = purchases.reduce((s, p) => s + (Number(p.quantity) * Number(p.unit_price) || 0), 0);
    const activeProjects = projects.filter(p => p.status !== 'completed').length;
    const totalLeads = leads.length;
    const closedLeads = leads.filter(l => l.stage === 'closed_won').length;
    const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;

    return [
      { label: 'Receita (Orçamentos)', value: `R$ ${(totalBudget / 1000).toFixed(0)}k`, change: 0, icon: 'DollarSign' },
      { label: 'Despesas (Compras)', value: `R$ ${(totalPurchases / 1000).toFixed(0)}k`, change: 0, icon: 'TrendingDown' },
      { label: 'Taxa de Conversão', value: `${conversionRate}%`, change: 0, icon: 'Target' },
      { label: 'Projetos Ativos', value: String(activeProjects), change: 0, icon: 'FolderKanban' },
    ];
  }, [projects, leads, purchases]);

  // Project status distribution for PieChart
  const projectStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });
    const labels: Record<string, string> = { planning: 'Planejamento', execution: 'Execução', review: 'Revisão', completed: 'Finalizado' };
    const fills = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];
    return Object.entries(counts).map(([key, value], i) => ({
      name: labels[key] || key,
      value,
      fill: fills[i % fills.length],
    }));
  }, [projects]);

  // Lead origin distribution for PieChart
  const leadOriginData = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach(l => { const o = l.origin || 'Direto'; counts[o] = (counts[o] || 0) + 1; });
    const fills = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
    return Object.entries(counts).map(([name, value], i) => ({
      name, value, fill: fills[i % fills.length],
    }));
  }, [leads]);

  // Monthly cash flow from purchases (expenses) and project budgets (revenue approximation)
  const cashFlowData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const now = new Date();
    const year = now.getFullYear();
    const data = months.map((month, i) => ({ month, receitas: 0, despesas: 0 }));

    projects.forEach(p => {
      const d = new Date(p.created_at);
      if (d.getFullYear() === year) {
        data[d.getMonth()].receitas += Number(p.budget) || 0;
      }
    });

    purchases.forEach(p => {
      const d = new Date(p.created_at);
      if (d.getFullYear() === year) {
        data[d.getMonth()].despesas += (Number(p.quantity) * Number(p.unit_price)) || 0;
      }
    });

    return data;
  }, [projects, purchases]);

  // Contracts evolution (leads that reached closed_won by month)
  const contractsEvolutionData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const now = new Date();
    const year = now.getFullYear();
    const data = months.map(month => ({ month, contratos: 0 }));

    leads.filter(l => l.stage === 'closed_won').forEach(l => {
      const d = new Date(l.updated_at || l.created_at);
      if (d.getFullYear() === year) {
        data[d.getMonth()].contratos += 1;
      }
    });

    return data;
  }, [leads]);

  return { kpis, projectStatusData, leadOriginData, cashFlowData, contractsEvolutionData, loading };
}
