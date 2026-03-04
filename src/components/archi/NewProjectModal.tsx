import { useState } from 'react';
import { X, CalendarIcon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from '@/components/ui/sonner';

interface NewProjectModalProps {
  open: boolean;
  onClose: () => void;
}

const NewProjectModal = ({ open, onClose }: NewProjectModalProps) => {
  const { currentTenant, addProject } = useApp();
  const [name, setName] = useState('');
  const [clientName, setClientName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<string>('medium');
  const [budget, setBudget] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!budget || Number(budget) <= 0) newErrors.budget = 'Orçamento inválido';
    if (!startDate) newErrors.startDate = 'Data de início é obrigatória';
    if (!endDate) newErrors.endDate = 'Data de prazo é obrigatória';
    if (startDate && endDate && endDate <= startDate) newErrors.endDate = 'Prazo deve ser após o início';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const { error } = await addProject({
      tenant_id: currentTenant.id,
      name: name.trim(),
      client_name: clientName.trim() || null,
      client_email: null,
      description: description.trim(),
      status: 'planning',
      progress: 0,
      priority,
      start_date: startDate!.toISOString().split('T')[0],
      end_date: endDate!.toISOString().split('T')[0],
      budget: Number(budget),
      stages: [
        { id: 's1', name: 'Briefing', completed: false, current: true, date: startDate!.toISOString().split('T')[0] },
        { id: 's2', name: 'Projeto Arquitetônico', completed: false, current: false, date: '' },
        { id: 's3', name: 'Execução', completed: false, current: false, date: '' },
        { id: 's4', name: 'Entrega', completed: false, current: false, date: endDate!.toISOString().split('T')[0] },
      ],
      photos: [],
    });

    if (error) {
      toast.error('Erro ao criar projeto: ' + error.message);
    } else {
      toast.success('Projeto criado com sucesso!');
      onClose();
      setName(''); setClientName(''); setDescription(''); setPriority('medium'); setBudget('');
      setStartDate(undefined); setEndDate(undefined); setErrors({});
    }
    setSubmitting(false);
  };

  const priorityOptions = [
    { value: 'low', label: 'Baixa', color: 'bg-emerald-100 text-emerald-700' },
    { value: 'medium', label: 'Média', color: 'bg-amber-100 text-amber-700' },
    { value: 'high', label: 'Alta', color: 'bg-orange-100 text-orange-700' },
    { value: 'urgent', label: 'Urgente', color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-card rounded-t-xl z-10">
          <h2 className="text-lg font-semibold text-foreground">Novo Projeto</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="text-sm font-medium text-foreground">Nome do Projeto *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Residência Parque Verde" maxLength={100} className="mt-1.5 w-full px-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Nome do Cliente</label>
            <input type="text" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nome do cliente" className="mt-1.5 w-full px-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Descrição *</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Descreva o projeto..." maxLength={500} rows={3} className="mt-1.5 w-full px-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
            {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Prioridade</label>
            <div className="mt-1.5 flex gap-2">
              {priorityOptions.map(opt => (
                <button key={opt.value} onClick={() => setPriority(opt.value)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all border-2', priority === opt.value ? `${opt.color} border-current` : 'bg-secondary text-muted-foreground border-transparent hover:bg-accent')}>{opt.label}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Orçamento (R$) *</label>
            <input type="text" value={budget} onChange={e => setBudget(e.target.value.replace(/[^0-9]/g, ''))} placeholder="Ex: 500000" className="mt-1.5 w-full px-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            {budget && <p className="text-xs text-muted-foreground mt-1">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(budget))}</p>}
            {errors.budget && <p className="text-xs text-destructive mt-1">{errors.budget}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">Data de Início *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn("mt-1.5 w-full flex items-center gap-2 px-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-ring", !startDate && "text-muted-foreground")}>
                    <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                    {startDate ? format(startDate, "dd/MM/yyyy") : "Selecionar"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3 pointer-events-auto" /></PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-xs text-destructive mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Prazo Final *</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button className={cn("mt-1.5 w-full flex items-center gap-2 px-4 py-2.5 text-sm bg-secondary border border-border rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-ring", !endDate && "text-muted-foreground")}>
                    <CalendarIcon className="w-4 h-4 flex-shrink-0" />
                    {endDate ? format(endDate, "dd/MM/yyyy") : "Selecionar"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={endDate} onSelect={setEndDate} disabled={(date) => startDate ? date <= startDate : false} initialFocus className="p-3 pointer-events-auto" /></PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-xs text-destructive mt-1">{errors.endDate}</p>}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border sticky bottom-0 bg-card rounded-b-xl">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent rounded-lg transition-colors">Cancelar</button>
          <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50">
            {submitting ? 'Criando...' : 'Criar Projeto'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewProjectModal;
