import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CalendarDays, Calculator, ClipboardCheck, FileText, X, GripVertical, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { categoryLabels, type TemplateCategory } from '@/data/templatesMockData';

const iconOptions = [
  { value: 'CalendarDays', label: 'Calendário', icon: CalendarDays },
  { value: 'Calculator', label: 'Calculadora', icon: Calculator },
  { value: 'ClipboardCheck', label: 'Checklist', icon: ClipboardCheck },
  { value: 'FileText', label: 'Documento', icon: FileText },
];

export interface StepMaterial {
  name: string;
  quantity: number;
  unit: string;
}

export interface TemplateStep {
  name: string;
  materials: StepMaterial[];
}

interface NewTemplateModalProps {
  onAdd: (t: { title: string; description: string; category: string; icon: string; content: any }) => Promise<any>;
}

const emptyStep = (): TemplateStep => ({ name: '', materials: [] });
const emptyMaterial = (): StepMaterial => ({ name: '', quantity: 1, unit: 'un' });

const NewTemplateModal = ({ onAdd }: NewTemplateModalProps) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'checklist' as TemplateCategory,
    icon: 'ClipboardCheck',
  });
  const [steps, setSteps] = useState<TemplateStep[]>([emptyStep()]);
  const [expandedStep, setExpandedStep] = useState<number | null>(0);

  const addStep = () => {
    setSteps(s => [...s, emptyStep()]);
    setExpandedStep(steps.length);
  };
  const removeStep = (i: number) => {
    setSteps(s => s.filter((_, idx) => idx !== i));
    if (expandedStep === i) setExpandedStep(null);
  };
  const updateStepName = (i: number, name: string) =>
    setSteps(s => s.map((st, idx) => (idx === i ? { ...st, name } : st)));

  const addMaterial = (stepIdx: number) =>
    setSteps(s => s.map((st, idx) => idx === stepIdx ? { ...st, materials: [...st.materials, emptyMaterial()] } : st));
  const removeMaterial = (stepIdx: number, matIdx: number) =>
    setSteps(s => s.map((st, idx) => idx === stepIdx ? { ...st, materials: st.materials.filter((_, mi) => mi !== matIdx) } : st));
  const updateMaterial = (stepIdx: number, matIdx: number, field: keyof StepMaterial, value: string | number) =>
    setSteps(s => s.map((st, idx) => idx === stepIdx ? {
      ...st,
      materials: st.materials.map((m, mi) => mi === matIdx ? { ...m, [field]: value } : m),
    } : st));

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const cleanSteps = steps
      .filter(s => s.name.trim() !== '')
      .map(s => ({
        ...s,
        materials: s.materials.filter(m => m.name.trim() !== ''),
      }));
    await onAdd({ ...form, content: { steps: cleanSteps } });
    setSaving(false);
    setForm({ title: '', description: '', category: 'checklist', icon: 'ClipboardCheck' });
    setSteps([emptyStep()]);
    setExpandedStep(0);
    setOpen(false);
  };

  const SelectedIcon = iconOptions.find(i => i.value === form.icon)?.icon || FileText;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 text-xs">
          <Plus className="w-4 h-4" /> Criar Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Título *</Label>
            <Input
              placeholder="Ex: Checklist de Vistoria Final"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Descrição breve</Label>
            <Input
              placeholder="Resumo do que este template inclui..."
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Categoria</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as TemplateCategory }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(categoryLabels) as TemplateCategory[]).map(c => (
                    <SelectItem key={c} value={c}>{categoryLabels[c]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Ícone</Label>
              <Select value={form.icon} onValueChange={v => setForm(f => ({ ...f, icon: v }))}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <SelectedIcon className="w-3.5 h-3.5" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>
                      <span className="flex items-center gap-2">
                        <opt.icon className="w-3.5 h-3.5" /> {opt.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Steps with Materials */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Etapas</Label>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={addStep}>
                <Plus className="w-3 h-3" /> Adicionar Etapa
              </Button>
            </div>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center gap-2 p-2 bg-secondary/30">
                    <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span className="text-xs text-muted-foreground w-5 shrink-0 font-medium">{i + 1}.</span>
                    <Input
                      placeholder={`Nome da etapa ${i + 1}...`}
                      value={step.name}
                      onChange={e => updateStepName(i, e.target.value)}
                      className="h-8 text-sm border-0 bg-transparent shadow-none focus-visible:ring-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 shrink-0"
                      onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                    >
                      {expandedStep === i ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </Button>
                    {steps.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => removeStep(i)}>
                        <X className="w-3.5 h-3.5 text-muted-foreground" />
                      </Button>
                    )}
                  </div>
                  {expandedStep === i && (
                    <div className="p-3 space-y-2 bg-background">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Package className="w-3 h-3" /> Materiais / Itens
                        </span>
                        <Button type="button" variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2" onClick={() => addMaterial(i)}>
                          <Plus className="w-2.5 h-2.5" /> Material
                        </Button>
                      </div>
                      {step.materials.length === 0 && (
                        <p className="text-[11px] text-muted-foreground italic py-1">Nenhum material vinculado</p>
                      )}
                      {step.materials.map((mat, mi) => (
                        <div key={mi} className="flex items-center gap-1.5">
                          <Input
                            placeholder="Material..."
                            value={mat.name}
                            onChange={e => updateMaterial(i, mi, 'name', e.target.value)}
                            className="h-7 text-xs flex-1"
                          />
                          <Input
                            type="number"
                            placeholder="Qtd"
                            value={mat.quantity}
                            onChange={e => updateMaterial(i, mi, 'quantity', Number(e.target.value))}
                            className="h-7 text-xs w-16"
                          />
                          <Input
                            placeholder="un"
                            value={mat.unit}
                            onChange={e => updateMaterial(i, mi, 'unit', e.target.value)}
                            className="h-7 text-xs w-14"
                          />
                          <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={() => removeMaterial(i, mi)}>
                            <X className="w-3 h-3 text-muted-foreground" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!form.title.trim() || saving}>
            {saving ? 'Salvando...' : 'Criar Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewTemplateModal;
