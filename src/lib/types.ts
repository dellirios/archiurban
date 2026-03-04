// Shared types and helpers (replaces mockData.ts)

export interface Tenant {
  id: string;
  name: string;
  logo: string | null;
  primary_color: string | null;
}

export interface ProjectStage {
  id: string;
  name: string;
  completed: boolean;
  current: boolean;
  date: string;
}

export interface ProjectPhoto {
  id: string;
  url: string;
  caption: string;
  date: string;
}

export interface Project {
  id: string;
  tenant_id: string;
  name: string;
  description: string | null;
  client_name: string | null;
  client_email: string | null;
  status: string;
  progress: number;
  priority: string;
  start_date: string | null;
  end_date: string | null;
  budget: number;
  stages: ProjectStage[];
  photos: ProjectPhoto[];
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  project_id: string;
  tenant_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  created_at: string;
}

export const statusLabels: Record<string, string> = {
  planning: 'Planejamento',
  execution: 'Execução',
  review: 'Revisão',
  completed: 'Finalizado',
};

export const priorityLabels: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

export const priorityColors: Record<string, string> = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export const statusColors: Record<string, string> = {
  planning: 'bg-sky-100 text-sky-700',
  execution: 'bg-violet-100 text-violet-700',
  review: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
