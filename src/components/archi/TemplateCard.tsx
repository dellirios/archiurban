import { CalendarDays, Calculator, ClipboardCheck, FileText, Users, Play, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Template } from '@/data/templatesMockData';

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
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  const Icon = iconMap[template.icon] || FileText;
  const catLabel = { schedule: 'Cronograma', budget: 'Orçamento', checklist: 'Checklist', contract: 'Contrato' }[template.category] || template.category;

  return (
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
          <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] gap-1">
            <Pencil className="w-3 h-3" /> Editar
          </Button>
          <Button size="sm" className="h-7 px-3 text-[11px] gap-1">
            <Play className="w-3 h-3" /> Usar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
