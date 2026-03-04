import { useState } from 'react';
import { CalendarDays, Calculator, ClipboardCheck, FileText, Users, Play, Pencil, Copy, Check, Loader2, Plus, X, GripVertical, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoryLabels, type TemplateCategory } from '@/data/templatesMockData';
import type { Template } from '@/data/templatesMockData';
import { toast } from 'sonner';
import type { TemplateStep, StepMaterial } from './NewTemplateModal';

const iconMap: Record<string, React.ElementType> = {
  CalendarDays, Calculator, ClipboardCheck, FileText,
};

const categoryColorMap: Record<string, string> = {
  schedule: 'bg-sky-100 text-sky-700',
  budget: 'bg-emerald-100 text-emerald-700',
  checklist: 'bg-amber-100 text-amber-700',
  contract: 'bg-violet-100 text-violet-700',
};

const emptyStep = (): TemplateStep => ({ name: '', materials: [] });
const emptyMaterial = (): StepMaterial => ({ name: '', quantity: 1, unit: 'un' });

/** Normalize legacy string[] steps to TemplateStep[] */
function normalizeSteps(content: any): TemplateStep[] {
  if (!content?.steps || !Array.isArray(content.steps)) return [];
  return content.steps.map((s: any) =>
    typeof s === 'string'
      ? { name: s, materials: [] }
      : { name: s.name || '', materials: Array.isArray(s.materials) ? s.materials : [] }
  );
}

interface TemplateCardProps {
  template: Template;
  content?: any;
  onDuplicate?: () => Promise<any>;
  onUpdate?: (data: { title: string; description: string; category: string; icon: string; content: any }) => Promise<any>;
}

const TemplateCard = ({ template, content, onDuplicate, onUpdate }: TemplateCardProps) => {
  const Icon = iconMap[template.icon] || FileText;
  const catLabel = categoryLabels[template.category] || template.category;
  const [duplicating, setDuplicating] = useState(false);
  const [duplicated, setDuplicated] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const steps = normalizeSteps(content);
  const totalMaterials = steps.reduce((sum, s) => sum + s.materials.length, 0);

  const [editForm, setEditForm] = useState({
    title: template.title,
    description: template.description,
    category: template.category as string,
    icon: template.icon,
  });
  const [editSteps, setEditSteps] = useState<TemplateStep[]>(steps.length > 0 ? steps : [emptyStep()]);
  const [expandedEditStep, setExpandedEditStep] = useState<number | null>(null);

  const handleDuplicate = async () => {
    if (!onDuplicate) return;
    setDuplicating(true);
    const result = await onDuplicate();
    setDuplicating(false);
    if (!result?.error) {
      setDuplicated(true);
      toast.success('Template duplicado para o seu escritório!');
      setTimeout(() => setDuplicated(false), 3000);
    }
  };

  const handleEdit = async () => {
    if (!onUpdate || !editForm.title.trim()) return;
    setSaving(true);
    const cleanSteps = editSteps
      .filter(s => s.name.trim() !== '')
      .map(s => ({ ...s, materials: s.materials.filter(m => m.name.trim() !== '') }));
    const result = await onUpdate({ ...editForm, content: { steps: cleanSteps } });
    setSaving(false);
    if (!result?.error) {
      toast.success('Template atualizado!');
      setEditOpen(false);
    }
  };

  const openEdit = () => {
    setEditForm({
      title: template.title,
      description: template.description,
      category: template.category,
      icon: template.icon,
    });
    const normalized = normalizeSteps(content);
    setEditSteps(normalized.length > 0 ? normalized.map(s => ({ ...s, materials: [...s.materials] })) : [emptyStep()]);
    setExpandedEditStep(null);
    setEditOpen(true);
  };

  // Edit step helpers
  const addEditStep = () => { setEditSteps(s => [...s, emptyStep()]); setExpandedEditStep(editSteps.length); };
  const removeEditStep = (i: number) => { setEditSteps(s => s.filter((_, idx) => idx !== i)); if (expandedEditStep === i) setExpandedEditStep(null); };
  const updateEditStepName = (i: number, name: string) => setEditSteps(s => s.map((st, idx) => idx === i ? { ...st, name } : st));
  const addEditMaterial = (si: number) => setEditSteps(s => s.map((st, idx) => idx === si ? { ...st, materials: [...st.materials, emptyMaterial()] } : st));
  const removeEditMaterial = (si: number, mi: number) => setEditSteps(s => s.map((st, idx) => idx === si ? { ...st, materials: st.materials.filter((_, j) => j !== mi) } : st));
  const updateEditMaterial = (si: number, mi: number, field: keyof StepMaterial, value: string | number) =>
    setEditSteps(s => s.map((st, idx) => idx === si ? { ...st, materials: st.materials.map((m, j) => j === mi ? { ...m, [field]: value } : m) } : st));

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow group flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <Badge variant="secondary" className={`text-[10px] ${categoryColorMap[template.category] || ''}`}>
            {catLabel}
          </Badge>
        </div>

        <h3 className="text-sm font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {template.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {template.description}
        </p>

        {/* Steps preview */}
        {steps.length > 0 && (
          <div className="mb-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[11px] text-primary font-medium hover:underline"
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {steps.length} etapa{steps.length !== 1 ? 's' : ''}
              {totalMaterials > 0 && (
                <span className="text-muted-foreground font-normal ml-1">
                  · {totalMaterials} {totalMaterials === 1 ? 'material' : 'materiais'}
                </span>
              )}
            </button>
            {expanded && (
              <div className="mt-1.5 space-y-1.5">
                {steps.map((s, i) => (
                  <div key={i}>
                    <p className="text-[11px] text-foreground font-medium">{i + 1}. {s.name}</p>
                    {s.materials.length > 0 && (
                      <ul className="ml-4 mt-0.5 space-y-0.5">
                        {s.materials.map((m, mi) => (
                          <li key={mi} className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <Package className="w-2.5 h-2.5" /> {m.name} — {m.quantity} {m.unit}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Users className="w-3 h-3" /> {template.usageCount} usos
          </span>
          <div className="flex gap-1.5">
            {template.community ? (
              <>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] gap-1" onClick={openEdit} disabled={!onUpdate}>
                  <Pencil className="w-3 h-3" /> Editar
                </Button>
                <Button
                  size="sm"
                  className="h-7 px-3 text-[11px] gap-1"
                  onClick={handleDuplicate}
                  disabled={duplicating || duplicated || !onDuplicate}
                >
                  {duplicating ? <Loader2 className="w-3 h-3 animate-spin" /> : duplicated ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {duplicated ? 'Copiado!' : 'Usar'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] gap-1" onClick={openEdit} disabled={!onUpdate}>
                  <Pencil className="w-3 h-3" /> Editar
                </Button>
                <Button size="sm" className="h-7 px-3 text-[11px] gap-1" disabled>
                  <Play className="w-3 h-3" /> Usar
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição breve</Label>
              <Input value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Categoria</Label>
                <Select value={editForm.category} onValueChange={v => setEditForm(f => ({ ...f, category: v }))}>
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
                <Select value={editForm.icon} onValueChange={v => setEditForm(f => ({ ...f, icon: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(iconMap).map(([key]) => (
                      <SelectItem key={key} value={key}>{key}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Steps with Materials */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Etapas</Label>
                <Button type="button" variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={addEditStep}>
                  <Plus className="w-3 h-3" /> Adicionar Etapa
                </Button>
              </div>
              <div className="space-y-2">
                {editSteps.map((step, i) => (
                  <div key={i} className="border border-border rounded-lg overflow-hidden">
                    <div className="flex items-center gap-2 p-2 bg-secondary/30">
                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground w-5 shrink-0 font-medium">{i + 1}.</span>
                      <Input
                        placeholder={`Nome da etapa ${i + 1}...`}
                        value={step.name}
                        onChange={e => updateEditStepName(i, e.target.value)}
                        className="h-8 text-sm border-0 bg-transparent shadow-none focus-visible:ring-0"
                      />
                      <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0"
                        onClick={() => setExpandedEditStep(expandedEditStep === i ? null : i)}>
                        {expandedEditStep === i ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </Button>
                      {editSteps.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0" onClick={() => removeEditStep(i)}>
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                    {expandedEditStep === i && (
                      <div className="p-3 space-y-2 bg-background">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Package className="w-3 h-3" /> Materiais / Itens
                          </span>
                          <Button type="button" variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2" onClick={() => addEditMaterial(i)}>
                            <Plus className="w-2.5 h-2.5" /> Material
                          </Button>
                        </div>
                        {step.materials.length === 0 && (
                          <p className="text-[11px] text-muted-foreground italic py-1">Nenhum material vinculado</p>
                        )}
                        {step.materials.map((mat, mi) => (
                          <div key={mi} className="flex items-center gap-1.5">
                            <Input placeholder="Material..." value={mat.name} onChange={e => updateEditMaterial(i, mi, 'name', e.target.value)} className="h-7 text-xs flex-1" />
                            <Input type="number" placeholder="Qtd" value={mat.quantity} onChange={e => updateEditMaterial(i, mi, 'quantity', Number(e.target.value))} className="h-7 text-xs w-16" />
                            <Input placeholder="un" value={mat.unit} onChange={e => updateEditMaterial(i, mi, 'unit', e.target.value)} className="h-7 text-xs w-14" />
                            <Button type="button" variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={() => removeEditMaterial(i, mi)}>
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
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button onClick={handleEdit} disabled={!editForm.title.trim() || saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TemplateCard;
