import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CalendarDays, Calculator, ClipboardCheck, FileText, X, GripVertical } from 'lucide-react';
import { categoryLabels, type TemplateCategory } from '@/data/templatesMockData';

const iconOptions = [
  { value: 'CalendarDays', label: 'Calendário', icon: CalendarDays },
  { value: 'Calculator', label: 'Calculadora', icon: Calculator },
  { value: 'ClipboardCheck', label: 'Checklist', icon: ClipboardCheck },
  { value: 'FileText', label: 'Documento', icon: FileText },
];

interface NewTemplateModalProps {
  onAdd: (t: { title: string; description: string; category: string; icon: string; content: any }) => Promise<any>;
}

const NewTemplateModal = ({ onAdd }: NewTemplateModalProps) => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'checklist' as TemplateCategory,
    icon: 'ClipboardCheck',
  });
  const [steps, setSteps] = useState<string[]>(['']);

  const addStep = () => setSteps(s => [...s, '']);
  const removeStep = (i: number) => setSteps(s => s.filter((_, idx) => idx !== i));
  const updateStep = (i: number, value: string) =>
    setSteps(s => s.map((v, idx) => (idx === i ? value : v)));

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    const cleanSteps = steps.filter(s => s.trim() !== '');
    await onAdd({ ...form, content: { steps: cleanSteps } });
    setSaving(false);
    setForm({ title: '', description: '', category: 'checklist', icon: 'ClipboardCheck' });
    setSteps(['']);
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

          {/* Steps */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Etapas</Label>
              <Button type="button" variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={addStep}>
                <Plus className="w-3 h-3" /> Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                  <Input
                    placeholder={`Etapa ${i + 1}...`}
                    value={step}
                    onChange={e => updateStep(i, e.target.value)}
                    className="h-8 text-sm"
                  />
                  {steps.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => removeStep(i)}>
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
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
