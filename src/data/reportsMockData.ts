// Mock data for Reports & Analytics module

export const kpiData = [
  { label: 'Receita Total', value: 'R$ 482.500', change: +12.4, icon: 'DollarSign' },
  { label: 'Despesas de Obra', value: 'R$ 198.300', change: -3.2, icon: 'TrendingDown' },
  { label: 'Taxa de Conversão', value: '34%', change: +5.8, icon: 'Target' },
  { label: 'Projetos Ativos', value: '12', change: +8.3, icon: 'FolderKanban' },
];

export const cashFlowData = [
  { month: 'Jan', receitas: 42000, despesas: 28000 },
  { month: 'Fev', receitas: 38000, despesas: 31000 },
  { month: 'Mar', receitas: 55000, despesas: 25000 },
  { month: 'Abr', receitas: 48000, despesas: 34000 },
  { month: 'Mai', receitas: 61000, despesas: 29000 },
  { month: 'Jun', receitas: 53000, despesas: 38000 },
  { month: 'Jul', receitas: 67000, despesas: 32000 },
  { month: 'Ago', receitas: 59000, despesas: 36000 },
  { month: 'Set', receitas: 72000, despesas: 41000 },
  { month: 'Out', receitas: 64000, despesas: 35000 },
  { month: 'Nov', receitas: 78000, despesas: 44000 },
  { month: 'Dez', receitas: 82000, despesas: 47000 },
];

export const projectStatusData = [
  { name: 'Planejamento', value: 3, fill: 'hsl(var(--chart-1))' },
  { name: 'Execução', value: 5, fill: 'hsl(var(--chart-2))' },
  { name: 'Revisão', value: 2, fill: 'hsl(var(--chart-3))' },
  { name: 'Finalizado', value: 4, fill: 'hsl(var(--chart-4))' },
];

export const leadOriginData = [
  { name: 'Instagram', value: 28, fill: 'hsl(var(--chart-1))' },
  { name: 'Indicação', value: 35, fill: 'hsl(var(--chart-2))' },
  { name: 'Google', value: 18, fill: 'hsl(var(--chart-3))' },
  { name: 'Direto', value: 12, fill: 'hsl(var(--chart-4))' },
  { name: 'Outros', value: 7, fill: 'hsl(var(--chart-5))' },
];

export const contractsEvolutionData = [
  { month: 'Jan', contratos: 1 },
  { month: 'Fev', contratos: 2 },
  { month: 'Mar', contratos: 1 },
  { month: 'Abr', contratos: 3 },
  { month: 'Mai', contratos: 2 },
  { month: 'Jun', contratos: 4 },
  { month: 'Jul', contratos: 3 },
  { month: 'Ago', contratos: 5 },
  { month: 'Set', contratos: 4 },
  { month: 'Out', contratos: 6 },
  { month: 'Nov', contratos: 5 },
  { month: 'Dez', contratos: 7 },
];

export const portfolioProjects = [
  { id: '1', name: 'Casa Moderna Alphaville', image: '/placeholder.svg', client: 'Roberto Silva', status: 'completed', isPublic: true, area: '320m²', year: '2025' },
  { id: '2', name: 'Apartamento Jardins', image: '/placeholder.svg', client: 'Marina Costa', status: 'completed', isPublic: true, area: '180m²', year: '2025' },
  { id: '3', name: 'Escritório Corporativo', image: '/placeholder.svg', client: 'TechCorp', status: 'completed', isPublic: false, area: '450m²', year: '2026' },
  { id: '4', name: 'Loft Vila Madalena', image: '/placeholder.svg', client: 'Ana Beatriz', status: 'completed', isPublic: true, area: '95m²', year: '2026' },
  { id: '5', name: 'Restaurante Bistrô', image: '/placeholder.svg', client: 'Chef Paulo', status: 'completed', isPublic: false, area: '210m²', year: '2026' },
  { id: '6', name: 'Cobertura Pinheiros', image: '/placeholder.svg', client: 'Família Monteiro', status: 'completed', isPublic: true, area: '280m²', year: '2025' },
];
