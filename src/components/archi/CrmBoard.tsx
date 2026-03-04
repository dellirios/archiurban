import { useState, useMemo } from 'react';
import { useCrmLeads } from '@/hooks/useCrmAndFiles';
import { useAuth } from '@/contexts/AuthContext';
import { crmStages, temperatureLabels, type LeadTemperature } from '@/data/crmMockData';
import { formatCurrency } from '@/lib/types';
import LeadCard from './LeadCard';
import NewLeadModal from './NewLeadModal';
import CrmMetrics from './CrmMetrics';
import LeadDetailModal from './LeadDetailModal';
import type { CrmLead } from '@/hooks/useCrmAndFiles';
import { Loader2, BarChart3, Filter, X, Flame, Thermometer, Snowflake } from 'lucide-react';
import { cn } from '@/lib/utils';

const ORIGINS = ['Instagram', 'Google', 'LinkedIn', 'Indicação', 'Site', 'Outro', 'Direto'];

const CrmBoard = () => {
  const { profile } = useAuth();
  const tenantId = profile?.tenant_id || 'tenant-1';
  const { leads, loading, addLead, updateLead } = useCrmLeads();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [showMetrics, setShowMetrics] = useState(true);
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [filterTemp, setFilterTemp] = useState<LeadTemperature | 'all'>('all');
  const [filterOrigin, setFilterOrigin] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const uniqueOrigins = useMemo(() => {
    const origins = new Set(leads.map(l => l.origin).filter(Boolean));
    return Array.from(origins).sort();
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      if (filterTemp !== 'all' && l.temperature !== filterTemp) return false;
      if (filterOrigin !== 'all' && l.origin !== filterOrigin) return false;
      return true;
    });
  }, [leads, filterTemp, filterOrigin]);

  const hasActiveFilters = filterTemp !== 'all' || filterOrigin !== 'all';
  const clearFilters = () => { setFilterTemp('all'); setFilterOrigin('all'); };

  const handleAddLead = async (lead: { name: string; email: string; phone: string; origin: string; estimatedValue: number }) => {
    await addLead({
      tenant_id: tenantId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      origin: lead.origin,
      estimated_value: lead.estimatedValue,
      temperature: 'warm',
      last_contact: new Date().toISOString().slice(0, 10),
      stage: 'new',
      notes: '',
    });
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(id);
  };

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    if (draggedId) {
      await updateLead(draggedId, { stage: newStage });
    }
    setDraggedId(null);
    setDragOverCol(null);
  };

  const handleLeadClick = (lead: CrmLead) => {
    setSelectedLead(lead);
  };

  const handleUpdateLead = async (id: string, data: Partial<CrmLead>) => {
    const result = await updateLead(id, data);
    // Update selected lead in place
    if (selectedLead?.id === id) {
      setSelectedLead(prev => prev ? { ...prev, ...data } : null);
    }
    return result;
  };

  const totalPipeline = leads.filter(l => l.stage !== 'closed').reduce((s, l) => s + (l.estimated_value || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Funil Comercial</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredLeads.length}{hasActiveFilters ? ` de ${leads.length}` : ''} leads · Pipeline: {formatCurrency(totalPipeline)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border',
              showFilters || hasActiveFilters ? 'bg-primary/10 text-primary border-primary/20' : 'bg-card text-muted-foreground border-border hover:text-foreground'
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            Filtros
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
          </button>
          <button
            onClick={() => setShowMetrics(!showMetrics)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors border',
              showMetrics ? 'bg-primary/10 text-primary border-primary/20' : 'bg-card text-muted-foreground border-border hover:text-foreground'
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Métricas
          </button>
          <NewLeadModal onAdd={handleAddLead} />
        </div>
      </div>

      {/* Filters bar */}
      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-3">
          <p className="text-xs font-medium text-muted-foreground mr-1">Temperatura:</p>
          {([
            { value: 'all' as const, label: 'Todas', icon: null },
            { value: 'hot' as const, label: 'Quente', icon: Flame },
            { value: 'warm' as const, label: 'Morno', icon: Thermometer },
            { value: 'cold' as const, label: 'Frio', icon: Snowflake },
          ]).map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterTemp(opt.value)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-colors',
                filterTemp === opt.value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-muted-foreground border-border hover:text-foreground'
              )}
            >
              {opt.icon && <opt.icon className="w-3 h-3" />}
              {opt.label}
            </button>
          ))}

          <div className="w-px h-5 bg-border mx-1" />

          <p className="text-xs font-medium text-muted-foreground mr-1">Origem:</p>
          <select
            value={filterOrigin}
            onChange={e => setFilterOrigin(e.target.value)}
            className="h-7 px-2 text-[11px] rounded-lg border border-border bg-secondary text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">Todas</option>
            {uniqueOrigins.map(o => <option key={o} value={o}>{o}</option>)}
          </select>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-[11px] text-destructive hover:text-destructive/80 ml-auto">
              <X className="w-3 h-3" /> Limpar
            </button>
          )}
        </div>
      )}

      {showMetrics && <CrmMetrics leads={filteredLeads} />}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {crmStages.map(col => {
          const colLeads = filteredLeads.filter(l => l.stage === col.key);
          const colTotal = colLeads.reduce((s, l) => s + (l.estimated_value || 0), 0);
          const isOver = dragOverCol === col.key;

          return (
            <div
              key={col.key}
              className="flex flex-col"
              onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; setDragOverCol(col.key); }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={e => handleDrop(e, col.key)}
            >
              <div className={`bg-card border border-border border-t-2 ${col.color} rounded-lg`}>
                <div className="px-3 py-2.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-medium text-foreground">{col.label}</h3>
                    <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-full">{colLeads.length}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">{formatCurrency(colTotal)}</p>
                </div>
              </div>

              <div className={`mt-2.5 space-y-2.5 min-h-[180px] rounded-lg transition-colors ${isOver ? 'bg-primary/5 ring-2 ring-primary/20 ring-dashed' : ''}`}>
                {colLeads.map(lead => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={e => handleDragStart(e, lead.id)}
                    onDragEnd={() => { setDraggedId(null); setDragOverCol(null); }}
                    className={`cursor-grab active:cursor-grabbing ${draggedId === lead.id ? 'opacity-40' : ''}`}
                    onClick={() => handleLeadClick(lead)}
                  >
                    <LeadCard lead={{
                      id: lead.id,
                      name: lead.name,
                      email: lead.email,
                      phone: lead.phone,
                      origin: lead.origin,
                      estimatedValue: lead.estimated_value || 0,
                      temperature: lead.temperature as LeadTemperature,
                      lastContact: lead.last_contact,
                      stage: lead.stage,
                    }} />
                  </div>
                ))}
                {colLeads.length === 0 && (
                  <div className="flex items-center justify-center h-28 border-2 border-dashed border-border rounded-lg">
                    <p className="text-[10px] text-muted-foreground">Arraste leads aqui</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <LeadDetailModal
        lead={selectedLead}
        open={!!selectedLead}
        onOpenChange={open => { if (!open) setSelectedLead(null); }}
        onUpdate={handleUpdateLead}
      />
    </div>
  );
};

export default CrmBoard;
