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
