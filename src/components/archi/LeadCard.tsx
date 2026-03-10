import { type Lead, temperatureLabels, temperatureColors } from '@/data/crmMockData';
import { formatCurrency } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Calendar, Flame, Snowflake, Thermometer, MessageCircle, CalendarPlus } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
}

const tempIcons: Record<string, React.ElementType> = {
  hot: Flame,
  warm: Thermometer,
  cold: Snowflake,
};

const getWhatsAppUrl = (phone: string, name: string) => {
  const cleaned = phone.replace(/\D/g, '');
  const message = encodeURIComponent(`Olá ${name}, tudo bem?`);
  return `https://wa.me/${cleaned}?text=${message}`;
};

const getGoogleCalendarUrl = (lead: Lead) => {
  const title = encodeURIComponent(`Reunião com ${lead.name}`);
  const details = encodeURIComponent(`Lead: ${lead.name}\nValor: ${formatCurrency(lead.estimatedValue)}\nOrigem: ${lead.origin}\nEmail: ${lead.email || '—'}\nTelefone: ${lead.phone || '—'}`);
  const now = new Date();
  const start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  start.setHours(10, 0, 0, 0);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&dates=${fmt(start)}/${fmt(end)}`;
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
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {lead.phone && (
            <a
              href={getWhatsAppUrl(lead.phone, lead.name)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="w-5 h-5 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 flex items-center justify-center transition-colors"
              title="WhatsApp"
            >
              <MessageCircle className="w-3 h-3 text-[#25D366]" />
            </a>
          )}
          <a
            href={getGoogleCalendarUrl(lead)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="w-5 h-5 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
            title="Agendar no Google Calendar"
          >
            <CalendarPlus className="w-3 h-3 text-primary" />
          </a>
          <Calendar className="w-3 h-3" />
          <span>{new Date(lead.lastContact).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
