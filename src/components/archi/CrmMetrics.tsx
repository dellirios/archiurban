import { Users, DollarSign, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import MetricCard from './MetricCard';
import { formatCurrency } from '@/lib/types';
import { crmStages, temperatureLabels, type LeadTemperature } from '@/data/crmMockData';
import type { CrmLead } from '@/hooks/useCrmAndFiles';

interface CrmMetricsProps {
  leads: CrmLead[];
}

const STAGE_COLORS = ['#38bdf8', '#8b5cf6', '#f59e0b', '#f97316', '#10b981'];
const TEMP_COLORS: Record<string, string> = { hot: '#ef4444', warm: '#f59e0b', cold: '#38bdf8' };

const CrmMetrics = ({ leads }: CrmMetricsProps) => {
  const totalLeads = leads.length;
  const pipelineValue = leads.filter(l => l.stage !== 'closed').reduce((s, l) => s + (l.estimated_value || 0), 0);
  const closedLeads = leads.filter(l => l.stage === 'closed');
  const closedValue = closedLeads.reduce((s, l) => s + (l.estimated_value || 0), 0);
  const conversionRate = totalLeads > 0 ? Math.round((closedLeads.length / totalLeads) * 100) : 0;
  const avgTicket = closedLeads.length > 0 ? closedValue / closedLeads.length : 0;

  const stageData = crmStages.map((s, i) => ({
    name: s.label,
    value: leads.filter(l => l.stage === s.key).length,
    fill: STAGE_COLORS[i],
  })).filter(d => d.value > 0);

  const tempData = (['hot', 'warm', 'cold'] as const).map(t => ({
    name: temperatureLabels[t],
    value: leads.filter(l => l.temperature === t).length,
    fill: TEMP_COLORS[t],
  })).filter(d => d.value > 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <MetricCard title="Total de Leads" value={totalLeads} icon={Users} />
        <MetricCard title="Pipeline Ativo" value={formatCurrency(pipelineValue)} icon={DollarSign} subtitle="Excluindo fechados" />
        <MetricCard title="Taxa de Conversão" value={`${conversionRate}%`} icon={Target} trend={conversionRate > 20 ? { value: 'Bom', positive: true } : undefined} />
        <MetricCard title="Ticket Médio" value={formatCurrency(avgTicket)} icon={TrendingUp} subtitle={`${closedLeads.length} contratos`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-muted-foreground" /> Leads por Etapa
          </h3>
          <div className="h-44">
            {stageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageData} layout="vertical" margin={{ left: 0, right: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={110} tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: 'hsl(var(--accent))' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={18}>
                    {stageData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Sem dados</div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-xs font-semibold text-foreground mb-3">Temperatura dos Leads</h3>
          <div className="h-44">
            {tempData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={tempData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={4} dataKey="value">
                    {tempData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Sem dados</div>
            )}
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {tempData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.fill }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrmMetrics;
