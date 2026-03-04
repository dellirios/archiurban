export type TemplateCategory = 'schedule' | 'budget' | 'checklist' | 'contract';

export interface Template {
  id: string;
  title: string;
  description: string;
  category: TemplateCategory;
  icon: string;
  usageCount: number;
  community: boolean;
  createdAt: string;
}

export const categoryLabels: Record<TemplateCategory, string> = {
  schedule: 'Cronograma',
  budget: 'Orçamento',
  checklist: 'Checklist',
  contract: 'Contrato',
};

export const categoryIcons: Record<TemplateCategory, string> = {
  schedule: 'CalendarDays',
  budget: 'Calculator',
  checklist: 'ClipboardCheck',
  contract: 'FileText',
};

export const mockTemplates: Template[] = [
  { id: '1', title: 'Reforma de Apartamento Padrão', description: 'Cronograma completo com 12 etapas para reforma residencial de até 80m².', category: 'schedule', icon: 'CalendarDays', usageCount: 34, community: false, createdAt: '2026-01-15' },
  { id: '2', title: 'Orçamento Obra Residencial', description: 'Planilha de orçamento com categorias pré-definidas e fórmulas automáticas.', category: 'budget', icon: 'Calculator', usageCount: 28, community: false, createdAt: '2026-01-20' },
  { id: '3', title: 'Vistoria Pré-Entrega', description: 'Checklist de 50 itens para vistoria final antes da entrega ao cliente.', category: 'checklist', icon: 'ClipboardCheck', usageCount: 45, community: false, createdAt: '2025-12-10' },
  { id: '4', title: 'Contrato de Prestação de Serviço', description: 'Modelo jurídico revisado para contratos de arquitetura e interiores.', category: 'contract', icon: 'FileText', usageCount: 19, community: false, createdAt: '2026-02-01' },
  { id: '5', title: 'Cronograma Comercial (Loja)', description: 'Template otimizado para projetos comerciais com foco em prazo reduzido.', category: 'schedule', icon: 'CalendarDays', usageCount: 12, community: true, createdAt: '2026-02-10' },
  { id: '6', title: 'Checklist de Instalações Elétricas', description: 'Verificação completa de pontos elétricos conforme norma NBR 5410.', category: 'checklist', icon: 'ClipboardCheck', usageCount: 67, community: true, createdAt: '2026-01-05' },
  { id: '7', title: 'Orçamento por Etapa (BDI)', description: 'Modelo com BDI calculado automaticamente por etapa de obra.', category: 'budget', icon: 'Calculator', usageCount: 22, community: true, createdAt: '2026-02-20' },
  { id: '8', title: 'Contrato de Acompanhamento de Obra', description: 'Modelo de contrato para serviço de acompanhamento técnico.', category: 'contract', icon: 'FileText', usageCount: 8, community: true, createdAt: '2026-03-01' },
];
