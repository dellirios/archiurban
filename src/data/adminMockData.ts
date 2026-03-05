// Super Admin mock data

export const adminKpis = {
  mrr: 47850,
  activeTenants: 124,
  newRegistrations: 18,
  churnRate: 2.1,
  mrrGrowth: 12.4,
  tenantGrowth: 8.2,
  registrationGrowth: -5.3,
  churnChange: -0.4,
};

export const revenueGrowthData = [
  { month: 'Abr 25', revenue: 28400, users: 78 },
  { month: 'Mai 25', revenue: 30200, users: 84 },
  { month: 'Jun 25', revenue: 31800, users: 89 },
  { month: 'Jul 25', revenue: 33500, users: 92 },
  { month: 'Ago 25', revenue: 35100, users: 96 },
  { month: 'Set 25', revenue: 36900, users: 100 },
  { month: 'Out 25', revenue: 38200, users: 104 },
  { month: 'Nov 25', revenue: 40100, users: 108 },
  { month: 'Dez 25', revenue: 41800, users: 112 },
  { month: 'Jan 26', revenue: 43500, users: 116 },
  { month: 'Fev 26', revenue: 45900, users: 120 },
  { month: 'Mar 26', revenue: 47850, users: 124 },
];

export type TenantPlan = 'Basic' | 'Pro' | 'Premium';
export type TenantStatus = 'Ativo' | 'Bloqueado' | 'Trial';

export interface AdminTenant {
  id: string;
  name: string;
  plan: TenantPlan;
  status: TenantStatus;
  activeUsers: number;
  registeredAt: string;
  email: string;
}

export const mockTenants: AdminTenant[] = [
  { id: 'T-001', name: 'Studio X Arquitetura', plan: 'Premium', status: 'Ativo', activeUsers: 8, registeredAt: '2025-03-15', email: 'contato@studiox.com.br' },
  { id: 'T-002', name: 'UrbanLab Design', plan: 'Pro', status: 'Ativo', activeUsers: 5, registeredAt: '2025-05-22', email: 'hello@urbanlab.arq.br' },
  { id: 'T-003', name: 'Arcos & Concreto', plan: 'Basic', status: 'Ativo', activeUsers: 2, registeredAt: '2025-07-10', email: 'admin@arcos.com' },
  { id: 'T-004', name: 'Forma Livre Projetos', plan: 'Pro', status: 'Trial', activeUsers: 3, registeredAt: '2026-01-08', email: 'projetos@formalivre.arq.br' },
  { id: 'T-005', name: 'Vertice Arquitetos', plan: 'Premium', status: 'Ativo', activeUsers: 12, registeredAt: '2025-01-20', email: 'info@vertice.com.br' },
  { id: 'T-006', name: 'Nuvem Estruturas', plan: 'Basic', status: 'Bloqueado', activeUsers: 0, registeredAt: '2025-09-03', email: 'suporte@nuvem.eng.br' },
  { id: 'T-007', name: 'Raiz Arquitetura', plan: 'Pro', status: 'Ativo', activeUsers: 4, registeredAt: '2025-11-14', email: 'equipe@raiz.arq.br' },
  { id: 'T-008', name: 'Horizonte Urbano', plan: 'Basic', status: 'Ativo', activeUsers: 1, registeredAt: '2026-02-01', email: 'contato@horizonte.com' },
  { id: 'T-009', name: 'Planta & Papel', plan: 'Premium', status: 'Ativo', activeUsers: 9, registeredAt: '2025-06-17', email: 'hello@plantaepapel.com.br' },
  { id: 'T-010', name: 'Módulo Oito', plan: 'Pro', status: 'Trial', activeUsers: 2, registeredAt: '2026-02-20', email: 'admin@modulooito.arq.br' },
];
