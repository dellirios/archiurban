import { useState } from 'react';
import PurchaseTable from '@/components/archi/PurchaseTable';
import PurchaseDrawer from '@/components/archi/PurchaseDrawer';
import { mockPurchases, type PurchaseItem } from '@/data/purchasesMockData';
import { ShoppingCart } from 'lucide-react';

const PurchasesPage = () => {
  const [items, setItems] = useState<PurchaseItem[]>(mockPurchases);

  const handleAdd = (item: { material: string; projectName: string; quantity: number; unit: string; supplier: string; unitPrice: number }) => {
    const newItem: PurchaseItem = {
      id: String(items.length + 1),
      reqId: `REQ-${String(items.length + 1).padStart(3, '0')}`,
      material: item.material,
      projectId: 'new',
      projectName: item.projectName,
      quantity: item.quantity,
      unit: item.unit,
      supplier: item.supplier,
      unitPrice: item.unitPrice,
      status: 'pending',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setItems(prev => [newItem, ...prev]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary" />
            Central de Compras
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie requisições e suprimentos de todas as obras</p>
        </div>
        <PurchaseDrawer onAdd={handleAdd} />
      </div>
      <PurchaseTable items={items} />
    </div>
  );
};

export default PurchasesPage;
