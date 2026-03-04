import { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/types';
import { crmStages, temperatureLabels, temperatureColors, type LeadTemperature } from '@/data/crmMockData';
import { cn } from '@/lib/utils';
import {
  Mail, Phone, MapPin, Calendar, Flame, Snowflake, Thermometer,
  Send, MessageSquare, PhoneCall, FileText, Clock, Trash2, Loader2,
} from 'lucide-react';
import type { CrmLead } from '@/hooks/useCrmAndFiles';

interface Interaction {
  id: string;
  type: string;
  content: string;
  created_by: string;
  created_at: string;
}

interface LeadDetailModalProps {
  lead: CrmLead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, data: Partial<CrmLead>) => Promise<any>;
}

const interactionTypes = [
  { value: 'note', label: 'Nota', icon: MessageSquare },
  { value: 'call', label: 'Ligação', icon: PhoneCall },
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'meeting', label: 'Reunião', icon: Calendar },
  { value: 'proposal', label: 'Proposta', icon: FileText },
];

const tempIcons: Record<string, React.ElementType> = { hot: Flame, warm: Thermometer, cold: Snowflake };

const LeadDetailModal = ({ lead, open, onOpenChange, onUpdate }: LeadDetailModalProps) => {
  const { profile, user } = useAuth();
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [newType, setNewType] = useState('note');
  const [newContent, setNewContent] = useState('');
  const [sending, setSending] = useState(false);

  const fetchInteractions = useCallback(async () => {
    if (!lead) return;
    setLoading(true);
    const { data } = await supabase
      .from('lead_interactions')
      .select('*')
      .eq('lead_id', lead.id)
      .order('created_at', { ascending: false });
    setInteractions((data as Interaction[] | null) ?? []);
    setLoading(false);
  }, [lead]);

  useEffect(() => {
    if (open && lead) fetchInteractions();
  }, [open, lead, fetchInteractions]);

  const handleAddInteraction = async () => {
    if (!lead || !newContent.trim() || !profile?.tenant_id) return;
    setSending(true);
    await supabase.from('lead_interactions').insert({
      lead_id: lead.id,
      tenant_id: profile.tenant_id,
      type: newType,
      content: newContent.trim(),
      created_by: profile.full_name || user?.email || 'Usuário',
      created_by_id: user?.id,
    } as any);
    // Update last_contact
    await onUpdate(lead.id, { last_contact: new Date().toISOString().slice(0, 10) });
    setNewContent('');
    setSending(false);
    fetchInteractions();
  };

  const handleDeleteInteraction = async (id: string) => {
    await supabase.from('lead_interactions').delete().eq('id', id);
    fetchInteractions();
  };

  if (!lead) return null;

  const TempIcon = tempIcons[lead.temperature] || Thermometer;
  const stageLabel = crmStages.find(s => s.key === lead.stage)?.label || lead.stage;
  const InteractionIcon = interactionTypes.find(t => t.value === newType)?.icon || MessageSquare;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-lg">{lead.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{stageLabel}</p>
            </div>
            <Badge className={cn('text-[11px]', temperatureColors[lead.temperature as LeadTemperature])}>
              <TempIcon className="w-3 h-3 mr-1" />
              {temperatureLabels[lead.temperature as LeadTemperature] || lead.temperature}
            </Badge>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 space-y-4">
          {/* Lead info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Valor</p>
              <p className="text-sm font-semibold text-foreground mt-0.5">{formatCurrency(lead.estimated_value || 0)}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Origem</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{lead.origin}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="text-xs text-foreground mt-0.5 truncate">{lead.email || '—'}</p>
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3 flex items-start gap-2">
              <Phone className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
              <div className="min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Telefone</p>
                <p className="text-xs text-foreground mt-0.5">{lead.phone || '—'}</p>
              </div>
            </div>
          </div>

          {/* Quick actions: change stage and temperature */}
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Etapa</p>
              <Select value={lead.stage} onValueChange={v => onUpdate(lead.id, { stage: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {crmStages.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Temperatura</p>
              <Select value={lead.temperature} onValueChange={v => onUpdate(lead.id, { temperature: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">🔥 Quente</SelectItem>
                  <SelectItem value="warm">🌡️ Morno</SelectItem>
                  <SelectItem value="cold">❄️ Frio</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Interactions */}
        <div className="px-6 py-3">
          <h3 className="text-xs font-semibold text-foreground mb-3">Histórico de Interações</h3>

          {/* Add interaction */}
          <div className="flex gap-2 mb-4">
            <Select value={newType} onValueChange={setNewType}>
              <SelectTrigger className="w-32 h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                {interactionTypes.map(t => (
                  <SelectItem key={t.value} value={t.value}>
                    <span className="flex items-center gap-1.5"><t.icon className="w-3 h-3" />{t.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              className="flex-1 h-9 text-xs"
              placeholder="Adicionar nota ou registro..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddInteraction()}
            />
            <Button size="sm" className="h-9" onClick={handleAddInteraction} disabled={!newContent.trim() || sending}>
              {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </Button>
          </div>

          {/* Timeline */}
          <ScrollArea className="h-52">
            {loading ? (
              <div className="flex items-center justify-center h-20"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>
            ) : interactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-20 text-muted-foreground">
                <Clock className="w-5 h-5 mb-1" />
                <p className="text-xs">Nenhuma interação registrada</p>
              </div>
            ) : (
              <div className="space-y-3 pr-3">
                {interactions.map(i => {
                  const typeInfo = interactionTypes.find(t => t.value === i.type);
                  const TypeIcon = typeInfo?.icon || MessageSquare;
                  return (
                    <div key={i.id} className="flex gap-3 group">
                      <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TypeIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-foreground">{typeInfo?.label || i.type}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(i.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            onClick={() => handleDeleteInteraction(i.id)}
                            className="ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{i.content}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">por {i.created_by}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailModal;
