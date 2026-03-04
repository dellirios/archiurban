export interface ProjectFile {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'dwg' | 'doc' | 'spreadsheet' | 'other';
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  folder: string;
  thumbnailUrl?: string;
}

export interface ProjectFolder {
  key: string;
  label: string;
  icon: string;
  count: number;
}

export const defaultFolders: ProjectFolder[] = [
  { key: 'plans', label: 'Plantas e Projetos', icon: 'ruler', count: 4 },
  { key: 'renders', label: 'Renders 3D', icon: 'image', count: 3 },
  { key: 'contracts', label: 'Contratos e Orçamentos', icon: 'file-text', count: 2 },
  { key: 'diary', label: 'Diário de Obra', icon: 'hard-hat', count: 3 },
];

export const mockFiles: ProjectFile[] = [
  { id: 'f1', name: 'Planta Baixa - Térreo.dwg', type: 'dwg', size: '4.2 MB', uploadedAt: '2026-02-20', uploadedBy: 'Carlos Mendes', folder: 'plans' },
  { id: 'f2', name: 'Planta Baixa - 1° Andar.dwg', type: 'dwg', size: '3.8 MB', uploadedAt: '2026-02-20', uploadedBy: 'Carlos Mendes', folder: 'plans' },
  { id: 'f3', name: 'Corte Longitudinal.pdf', type: 'pdf', size: '1.1 MB', uploadedAt: '2026-02-22', uploadedBy: 'Ana Silva', folder: 'plans' },
  { id: 'f4', name: 'Projeto Estrutural.pdf', type: 'pdf', size: '2.5 MB', uploadedAt: '2026-02-25', uploadedBy: 'João Pereira', folder: 'plans' },
  { id: 'f5', name: 'Fachada Principal.png', type: 'image', size: '8.4 MB', uploadedAt: '2026-03-01', uploadedBy: 'Carlos Mendes', folder: 'renders' },
  { id: 'f6', name: 'Vista Aérea.png', type: 'image', size: '12.1 MB', uploadedAt: '2026-03-01', uploadedBy: 'Carlos Mendes', folder: 'renders' },
  { id: 'f7', name: 'Interior - Sala.jpg', type: 'image', size: '5.6 MB', uploadedAt: '2026-03-02', uploadedBy: 'Ana Silva', folder: 'renders' },
  { id: 'f8', name: 'Contrato de Prestação.pdf', type: 'pdf', size: '340 KB', uploadedAt: '2026-01-15', uploadedBy: 'Admin', folder: 'contracts' },
  { id: 'f9', name: 'Orçamento Detalhado.xlsx', type: 'spreadsheet', size: '890 KB', uploadedAt: '2026-02-10', uploadedBy: 'Admin', folder: 'contracts' },
  { id: 'f10', name: 'Relatório Semana 1.pdf', type: 'pdf', size: '1.8 MB', uploadedAt: '2026-02-28', uploadedBy: 'João Pereira', folder: 'diary' },
  { id: 'f11', name: 'Foto Fundação.jpg', type: 'image', size: '3.2 MB', uploadedAt: '2026-03-01', uploadedBy: 'João Pereira', folder: 'diary' },
  { id: 'f12', name: 'Relatório Semana 2.pdf', type: 'pdf', size: '2.1 MB', uploadedAt: '2026-03-04', uploadedBy: 'João Pereira', folder: 'diary' },
];
