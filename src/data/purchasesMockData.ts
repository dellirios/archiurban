export type PurchaseStatus = 'pending' | 'quoting' | 'approved' | 'purchased' | 'delivered';

export interface PurchaseItem {
  id: string;
  reqId: string;
  material: string;
  projectId: string;
  projectName: string;
  quantity: number;
  unit: string;
  supplier: string;
  unitPrice: number;
  status: PurchaseStatus;
  createdAt: string;
}

export const purchaseStatusLabels: Record<PurchaseStatus, string> = {
  pending: 'Pendente',
  quoting: 'Em Cotação',
  approved: 'Aprovado',
  purchased: 'Comprado',
  delivered: 'Entregue',
};

export const purchaseStatusColors: Record<PurchaseStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  quoting: 'bg-sky-100 text-sky-700',
  approved: 'bg-violet-100 text-violet-700',
  purchased: 'bg-emerald-100 text-emerald-700',
  delivered: 'bg-emerald-50 text-emerald-600',
};

export const mockPurchases: PurchaseItem[] = [
  { id: '1', reqId: 'REQ-001', material: 'Porcelanato Portobello 60x60', projectId: 'p1', projectName: 'Residência Vila Nova', quantity: 120, unit: 'm²', supplier: 'Leroy Merlin', unitPrice: 89.90, status: 'pending', createdAt: '2026-03-01' },
  { id: '2', reqId: 'REQ-002', material: 'Tinta Suvinil Fosco Branco 18L', projectId: 'p2', projectName: 'Edifício Aurora', quantity: 15, unit: 'un', supplier: 'Tintas MC', unitPrice: 320.00, status: 'quoting', createdAt: '2026-02-28' },
  { id: '3', reqId: 'REQ-003', material: 'Cabo Flexível 2.5mm 100m', projectId: 'p1', projectName: 'Residência Vila Nova', quantity: 8, unit: 'rolo', supplier: 'Elétrica Brasil', unitPrice: 185.00, status: 'approved', createdAt: '2026-02-25' },
  { id: '4', reqId: 'REQ-004', material: 'Cimento CP-II 50kg', projectId: 'p3', projectName: 'Reforma Apt. 302', quantity: 200, unit: 'saco', supplier: 'Votorantim', unitPrice: 38.50, status: 'purchased', createdAt: '2026-02-20' },
  { id: '5', reqId: 'REQ-005', material: 'Bloco Cerâmico 14x19x39', projectId: 'p2', projectName: 'Edifício Aurora', quantity: 3000, unit: 'un', supplier: 'Cerâmica Real', unitPrice: 2.80, status: 'delivered', createdAt: '2026-02-15' },
  { id: '6', reqId: 'REQ-006', material: 'Piso Laminado Eucafloor 8mm', projectId: 'p3', projectName: 'Reforma Apt. 302', quantity: 45, unit: 'm²', supplier: 'Leroy Merlin', unitPrice: 62.00, status: 'quoting', createdAt: '2026-03-02' },
  { id: '7', reqId: 'REQ-007', material: 'Metais Deca Linha Aspen', projectId: 'p1', projectName: 'Residência Vila Nova', quantity: 6, unit: 'kit', supplier: 'Casa & Construção', unitPrice: 450.00, status: 'pending', createdAt: '2026-03-03' },
];

export const mockSuppliers = ['Leroy Merlin', 'Tintas MC', 'Elétrica Brasil', 'Votorantim', 'Cerâmica Real', 'Casa & Construção'];
export const mockProjects = ['Residência Vila Nova', 'Edifício Aurora', 'Reforma Apt. 302'];
