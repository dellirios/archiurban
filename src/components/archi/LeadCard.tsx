import { type Lead, temperatureLabels, temperatureColors } from '@/data/crmMockData';
import { formatCurrency } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Calendar, Flame, Snowflake, Thermometer } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
}

const tempIcons: Record<string, React.ElementType> = {
  hot: Flame,
  warm: Thermometer,
  cold: Snowflake,
};

const LeadCard = ({ lead }: LeadCardProps) => {
  const TempIcon = tempIcons[lead.temperature] || Thermometer;

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start justify-between mb-2.5">
        <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {lead.name}
        </h4>
        <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2 inline-flex items-center gap-1', temperatureColors[lead.temperature])}>
          <TempIcon className="w-3 h-3" />
          {temperatureLabels[lead.temperature]}
        </span>
      </div>

      <p className="text-lg font-bold text-foreground mb-3">
        {formatCurrency(lead.estimatedValue)}
      </p>

      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="truncate">{lead.origin}</span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Calendar className="w-3 h-3" />
          <span>{new Date(lead.lastContact).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
