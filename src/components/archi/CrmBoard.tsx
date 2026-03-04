import { useState } from 'react';
import { type Lead, crmStages, mockLeads } from '@/data/crmMockData';
import { formatCurrency } from '@/lib/types';
import LeadCard from './LeadCard';
import NewLeadModal from './NewLeadModal';

const CrmBoard = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const handleAddLead = (lead: Lead) => {
    setLeads(prev => [lead, ...prev]);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(colKey);
  };

  const handleDrop = (e: React.DragEvent, newStage: string) => {
    e.preventDefault();
    if (draggedId) {
      setLeads(prev => prev.map(l => l.id === draggedId ? { ...l, stage: newStage } : l));
    }
    setDraggedId(null);
    setDragOverCol(null);
  };

  const totalPipeline = leads.filter(l => l.stage !== 'closed').reduce((s, l) => s + l.estimatedValue, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Funil Comercial</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {leads.length} leads · Pipeline: {formatCurrency(totalPipeline)}
          </p>
        </div>
        <NewLeadModal onAdd={handleAddLead} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {crmStages.map(col => {
          const colLeads = leads.filter(l => l.stage === col.key);
          const colTotal = colLeads.reduce((s, l) => s + l.estimatedValue, 0);
          const isOver = dragOverCol === col.key;

          return (
            <div
              key={col.key}
              className="flex flex-col"
              onDragOver={e => handleDragOver(e, col.key)}
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
