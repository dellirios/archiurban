import { useState } from 'react';
import { CalendarDays, Calculator, ClipboardCheck, FileText, Users, Play, Pencil, Copy, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categoryLabels, type TemplateCategory } from '@/data/templatesMockData';
import type { Template } from '@/data/templatesMockData';
import { toast } from 'sonner';

const iconMap: Record<string, React.ElementType> = {
  CalendarDays, Calculator, ClipboardCheck, FileText,
};

const categoryColorMap: Record<string, string> = {
  schedule: 'bg-sky-100 text-sky-700',
  budget: 'bg-emerald-100 text-emerald-700',
  checklist: 'bg-amber-100 text-amber-700',
  contract: 'bg-violet-100 text-violet-700',
};

interface TemplateCardProps {
  template: Template;
  onDuplicate?: () => Promise<any>;
  onUpdate?: (data: { title: string; description: string; category: string; icon: string }) => Promise<any>;
}

const TemplateCard = ({ template, onDuplicate, onUpdate }: TemplateCardProps) => {
  const Icon = iconMap[template.icon] || FileText;
  const catLabel = categoryLabels[template.category] || template.category;
  const [duplicating, setDuplicating] = useState(false);
  const [duplicated, setDuplicated] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: template.title,
    description: template.description,
    category: template.category as string,
    icon: template.icon,
  });

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
    const result = await onUpdate(editForm);
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
    setEditOpen(true);
  };

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
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2 flex-1">
          {template.description}
        </p>

        <div className="flex items-center justify-between">
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Título *</Label>
              <Input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Descrição</Label>
              <Textarea rows={3} value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
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
