import { useState } from 'react';
import { useCrmLeads } from '@/hooks/useCrmAndFiles';
import { useAuth } from '@/contexts/AuthContext';
import { crmStages, temperatureLabels, temperatureColors, type LeadTemperature } from '@/data/crmMockData';
import { formatCurrency } from '@/lib/types';
import LeadCard from './LeadCard';
import NewLeadModal from './NewLeadModal';
import { Loader2 } from 'lucide-react';

const CrmBoard = () => {
  const { profile } = useAuth();
  const tenantId = profile?.tenant_id || 'tenant-1';
  const { leads, loading, addLead, updateLead } = useCrmLeads();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

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

  const mappedLeads = leads.map(l => ({
    id: l.id,
    name: l.name,
    email: l.email,
    phone: l.phone,
    origin: l.origin,
    estimatedValue: l.estimated_value,
    temperature: l.temperature as LeadTemperature,
    lastContact: l.last_contact,
    stage: l.stage,
  }));

  const totalPipeline = mappedLeads.filter(l => l.stage !== 'closed').reduce((s, l) => s + l.estimatedValue, 0);

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
            {mappedLeads.length} leads · Pipeline: {formatCurrency(totalPipeline)}
          </p>
        </div>
        <NewLeadModal onAdd={handleAddLead} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {crmStages.map(col => {
          const colLeads = mappedLeads.filter(l => l.stage === col.key);
          const colTotal = colLeads.reduce((s, l) => s + l.estimatedValue, 0);
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
                  >
                    <LeadCard lead={lead} />
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
    </div>
  );
};

export default CrmBoard;
