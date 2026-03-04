export interface Tenant {
  id: string;
  name: string;
  logo: string;
  primaryColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'architect' | 'client';
  tenantId: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  tenantId: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  completed: boolean;
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
  name: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  status: 'planning' | 'execution' | 'review' | 'completed';
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate: string;
  tenantId: string;
  description: string;
  stages: ProjectStage[];
  photos: ProjectPhoto[];
  budget: number;
}

export interface ProjectStage {
  id: string;
  name: string;
  completed: boolean;
  current: boolean;
  date: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  tenantId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// ── TENANTS ──
export const tenants: Tenant[] = [
  { id: 'tenant-1', name: 'Studio Arcos', logo: 'SA', primaryColor: '#1e3a5f' },
  { id: 'tenant-2', name: 'Construtora Horizonte', logo: 'CH', primaryColor: '#4a5568' },
];

// ── USERS ──
export const users: User[] = [
  { id: 'u1', name: 'Ana Oliveira', email: 'ana@studioarcos.com', avatar: 'AO', role: 'architect', tenantId: 'tenant-1' },
  { id: 'u2', name: 'Carlos Mendes', email: 'carlos@horizonte.com', avatar: 'CM', role: 'architect', tenantId: 'tenant-2' },
  { id: 'u3', name: 'Roberto Silva', email: 'roberto@email.com', avatar: 'RS', role: 'client', tenantId: 'tenant-1' },
];

// ── CLIENTS ──
export const clients: Client[] = [
  { id: 'c1', name: 'Roberto Silva', email: 'roberto@email.com', phone: '(11) 98765-4321', avatar: 'RS', tenantId: 'tenant-1' },
  { id: 'c2', name: 'Mariana Costa', email: 'mariana@email.com', phone: '(21) 99876-5432', avatar: 'MC', tenantId: 'tenant-1' },
  { id: 'c3', name: 'João Ferreira', email: 'joao@email.com', phone: '(31) 97654-3210', avatar: 'JF', tenantId: 'tenant-1' },
  { id: 'c4', name: 'Patrícia Lima', email: 'patricia@email.com', phone: '(41) 96543-2109', avatar: 'PL', tenantId: 'tenant-2' },
  { id: 'c5', name: 'Fernando Alves', email: 'fernando@email.com', phone: '(51) 95432-1098', avatar: 'FA', tenantId: 'tenant-2' },
];

// ── TEAM MEMBERS ──
export const teamMembers: TeamMember[] = [
  { id: 't1', name: 'Ana Oliveira', role: 'Arquiteta Principal', avatar: 'AO', tenantId: 'tenant-1' },
  { id: 't2', name: 'Lucas Prado', role: 'Engenheiro Civil', avatar: 'LP', tenantId: 'tenant-1' },
  { id: 't3', name: 'Beatriz Nunes', role: 'Designer de Interiores', avatar: 'BN', tenantId: 'tenant-1' },
  { id: 't4', name: 'Carlos Mendes', role: 'Diretor de Obras', avatar: 'CM', tenantId: 'tenant-2' },
  { id: 't5', name: 'Renata Souza', role: 'Coordenadora de Projetos', avatar: 'RS', tenantId: 'tenant-2' },
];

// ── PROJECTS ──
export const projects: Project[] = [
  {
    id: 'p1',
    name: 'Residência Vila Nova',
    clientId: 'c1',
    clientName: 'Roberto Silva',
    clientAvatar: 'RS',
    status: 'execution',
    progress: 65,
    priority: 'high',
    startDate: '2024-01-15',
    endDate: '2024-08-30',
    tenantId: 'tenant-1',
    description: 'Casa residencial de alto padrão com 3 pavimentos, piscina e área gourmet.',
    budget: 1200000,
    stages: [
      { id: 's1', name: 'Projeto Arquitetônico', completed: true, current: false, date: '2024-01-15' },
      { id: 's2', name: 'Fundação', completed: true, current: false, date: '2024-02-20' },
      { id: 's3', name: 'Estrutura', completed: true, current: false, date: '2024-03-15' },
      { id: 's4', name: 'Alvenaria', completed: true, current: false, date: '2024-04-10' },
      { id: 's5', name: 'Instalações', completed: false, current: true, date: '2024-05-20' },
      { id: 's6', name: 'Acabamento', completed: false, current: false, date: '2024-07-01' },
      { id: 's7', name: 'Entrega', completed: false, current: false, date: '2024-08-30' },
    ],
    photos: [
      { id: 'ph1', url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop', caption: 'Fundação concluída', date: '2024-02-20' },
      { id: 'ph2', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop', caption: 'Estrutura em andamento', date: '2024-03-15' },
      { id: 'ph3', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop', caption: 'Alvenaria - 2º pavimento', date: '2024-04-10' },
      { id: 'ph4', url: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop', caption: 'Instalações elétricas', date: '2024-05-15' },
    ],
  },
  {
    id: 'p2',
    name: 'Apartamento Jardins',
    clientId: 'c2',
    clientName: 'Mariana Costa',
    clientAvatar: 'MC',
    status: 'planning',
    progress: 15,
    priority: 'medium',
    startDate: '2024-03-01',
    endDate: '2024-12-15',
    tenantId: 'tenant-1',
    description: 'Reforma completa de apartamento de 180m² com integração de ambientes.',
    budget: 450000,
    stages: [
      { id: 's1', name: 'Levantamento', completed: true, current: false, date: '2024-03-01' },
      { id: 's2', name: 'Projeto Arquitetônico', completed: false, current: true, date: '2024-04-15' },
      { id: 's3', name: 'Demolição', completed: false, current: false, date: '2024-06-01' },
      { id: 's4', name: 'Reforma', completed: false, current: false, date: '2024-08-01' },
      { id: 's5', name: 'Acabamento', completed: false, current: false, date: '2024-10-15' },
      { id: 's6', name: 'Entrega', completed: false, current: false, date: '2024-12-15' },
    ],
    photos: [
      { id: 'ph1', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop', caption: 'Estado atual do apartamento', date: '2024-03-01' },
    ],
  },
  {
    id: 'p3',
    name: 'Edifício Comercial Aurora',
    clientId: 'c3',
    clientName: 'João Ferreira',
    clientAvatar: 'JF',
    status: 'review',
    progress: 90,
    priority: 'urgent',
    startDate: '2023-06-01',
    endDate: '2024-05-30',
    tenantId: 'tenant-1',
    description: 'Edifício comercial de 8 andares com certificação LEED.',
    budget: 8500000,
    stages: [
      { id: 's1', name: 'Projeto', completed: true, current: false, date: '2023-06-01' },
      { id: 's2', name: 'Fundação', completed: true, current: false, date: '2023-08-15' },
      { id: 's3', name: 'Estrutura', completed: true, current: false, date: '2023-11-01' },
      { id: 's4', name: 'Vedação', completed: true, current: false, date: '2024-01-20' },
      { id: 's5', name: 'Acabamento', completed: true, current: false, date: '2024-03-15' },
      { id: 's6', name: 'Revisão Final', completed: false, current: true, date: '2024-05-01' },
      { id: 's7', name: 'Entrega', completed: false, current: false, date: '2024-05-30' },
    ],
    photos: [
      { id: 'ph1', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop', caption: 'Fachada em fase de conclusão', date: '2024-04-10' },
      { id: 'ph2', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop', caption: 'Interior - Lobby principal', date: '2024-04-20' },
    ],
  },
  {
    id: 'p4',
    name: 'Casa de Campo Serra',
    clientId: 'c1',
    clientName: 'Roberto Silva',
    clientAvatar: 'RS',
    status: 'completed',
    progress: 100,
    priority: 'low',
    startDate: '2023-01-10',
    endDate: '2023-11-20',
    tenantId: 'tenant-1',
    description: 'Casa de campo sustentável com energia solar e captação de água.',
    budget: 780000,
    stages: [
      { id: 's1', name: 'Projeto', completed: true, current: false, date: '2023-01-10' },
      { id: 's2', name: 'Fundação', completed: true, current: false, date: '2023-03-01' },
      { id: 's3', name: 'Estrutura', completed: true, current: false, date: '2023-05-15' },
      { id: 's4', name: 'Acabamento', completed: true, current: false, date: '2023-09-01' },
      { id: 's5', name: 'Entrega', completed: true, current: false, date: '2023-11-20' },
    ],
    photos: [
      { id: 'ph1', url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400&h=300&fit=crop', caption: 'Casa finalizada - vista frontal', date: '2023-11-15' },
    ],
  },
  {
    id: 'p5',
    name: 'Condomínio Horizonte',
    clientId: 'c4',
    clientName: 'Patrícia Lima',
    clientAvatar: 'PL',
    status: 'execution',
    progress: 40,
    priority: 'high',
    startDate: '2024-02-01',
    endDate: '2025-06-30',
    tenantId: 'tenant-2',
    description: 'Condomínio residencial com 4 torres e área de lazer completa.',
    budget: 25000000,
    stages: [
      { id: 's1', name: 'Projeto', completed: true, current: false, date: '2024-02-01' },
      { id: 's2', name: 'Terraplanagem', completed: true, current: false, date: '2024-04-01' },
      { id: 's3', name: 'Fundação', completed: false, current: true, date: '2024-06-15' },
      { id: 's4', name: 'Estrutura', completed: false, current: false, date: '2024-12-01' },
      { id: 's5', name: 'Acabamento', completed: false, current: false, date: '2025-04-01' },
      { id: 's6', name: 'Entrega', completed: false, current: false, date: '2025-06-30' },
    ],
    photos: [
      { id: 'ph1', url: 'https://images.unsplash.com/photo-1590725140246-20acdee442be?w=400&h=300&fit=crop', caption: 'Terraplanagem concluída', date: '2024-04-15' },
    ],
  },
  {
    id: 'p6',
    name: 'Escritório Tech Hub',
    clientId: 'c5',
    clientName: 'Fernando Alves',
    clientAvatar: 'FA',
    status: 'planning',
    progress: 10,
    priority: 'medium',
    startDate: '2024-05-01',
    endDate: '2025-03-30',
    tenantId: 'tenant-2',
    description: 'Espaço corporativo open-plan com salas de reunião e coworking.',
    budget: 3200000,
    stages: [
      { id: 's1', name: 'Briefing', completed: true, current: false, date: '2024-05-01' },
      { id: 's2', name: 'Conceito', completed: false, current: true, date: '2024-06-01' },
      { id: 's3', name: 'Projeto Executivo', completed: false, current: false, date: '2024-08-01' },
      { id: 's4', name: 'Execução', completed: false, current: false, date: '2024-11-01' },
      { id: 's5', name: 'Entrega', completed: false, current: false, date: '2025-03-30' },
    ],
    photos: [],
  },
];

// ── NOTIFICATIONS ──
export const notifications: Notification[] = [
  { id: 'n1', title: 'Nova atualização', message: 'Fotos da obra Vila Nova foram adicionadas', time: '2 min atrás', read: false },
  { id: 'n2', title: 'Prazo próximo', message: 'Edifício Aurora - Revisão final em 5 dias', time: '1h atrás', read: false },
  { id: 'n3', title: 'Novo comentário', message: 'Mariana Costa comentou no projeto Jardins', time: '3h atrás', read: true },
  { id: 'n4', title: 'Aprovação pendente', message: 'Orçamento do Condomínio Horizonte aguarda aprovação', time: '5h atrás', read: true },
];

// ── HELPERS ──
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
