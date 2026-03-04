export type LeadTemperature = 'hot' | 'warm' | 'cold';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  origin: string;
  estimatedValue: number;
  temperature: LeadTemperature;
  lastContact: string;
  stage: string;
}

export const crmStages = [
  { key: 'new', label: 'Novos Leads', color: 'border-t-sky-400' },
  { key: 'meeting', label: 'Reunião Agendada', color: 'border-t-violet-400' },
  { key: 'proposal', label: 'Proposta Enviada', color: 'border-t-amber-400' },
  { key: 'negotiation', label: 'Em Negociação', color: 'border-t-orange-400' },
  { key: 'closed', label: 'Fechado/Ganho', color: 'border-t-emerald-400' },
] as const;

export const mockLeads: Lead[] = [
  { id: '1', name: 'Ricardo Almeida', email: 'ricardo@email.com', phone: '(11) 99999-0001', origin: 'Instagram', estimatedValue: 450000, temperature: 'hot', lastContact: '2026-03-02', stage: 'new' },
  { id: '2', name: 'Fernanda Costa', email: 'fernanda@email.com', phone: '(11) 98888-0002', origin: 'Indicação', estimatedValue: 780000, temperature: 'warm', lastContact: '2026-02-28', stage: 'meeting' },
  { id: '3', name: 'Grupo Horizonte', email: 'contato@horizonte.com', phone: '(21) 97777-0003', origin: 'Site', estimatedValue: 1200000, temperature: 'hot', lastContact: '2026-03-01', stage: 'proposal' },
  { id: '4', name: 'Marina Santos', email: 'marina@email.com', phone: '(11) 96666-0004', origin: 'LinkedIn', estimatedValue: 320000, temperature: 'cold', lastContact: '2026-02-20', stage: 'new' },
  { id: '5', name: 'Paulo Mendes Arq.', email: 'paulo@mendes.com', phone: '(31) 95555-0005', origin: 'Indicação', estimatedValue: 950000, temperature: 'warm', lastContact: '2026-03-03', stage: 'negotiation' },
  { id: '6', name: 'Construtora Viva', email: 'projetos@viva.com', phone: '(11) 94444-0006', origin: 'Google', estimatedValue: 2100000, temperature: 'hot', lastContact: '2026-03-04', stage: 'closed' },
  { id: '7', name: 'Ana Beatriz Lopes', email: 'ana@email.com', phone: '(21) 93333-0007', origin: 'Instagram', estimatedValue: 180000, temperature: 'cold', lastContact: '2026-02-15', stage: 'proposal' },
];

export const temperatureLabels: Record<LeadTemperature, string> = {
  hot: 'Quente',
  warm: 'Morno',
  cold: 'Frio',
};

export const temperatureColors: Record<LeadTemperature, string> = {
  hot: 'bg-red-100 text-red-700',
  warm: 'bg-amber-100 text-amber-700',
  cold: 'bg-sky-100 text-sky-700',
};
