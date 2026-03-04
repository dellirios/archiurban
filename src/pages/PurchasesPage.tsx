import PurchaseTable from '@/components/archi/PurchaseTable';
import PurchaseDrawer from '@/components/archi/PurchaseDrawer';
import { usePurchases } from '@/hooks/usePurchasesAndTemplates';
import { ShoppingCart, Loader2 } from 'lucide-react';

const PurchasesPage = () => {
  const { items, loading, addPurchase, updatePurchase } = usePurchases();

  const handleAdd = async (item: { material: string; projectName: string; quantity: number; unit: string; supplier: string; unitPrice: number }) => {
    await addPurchase({
      material: item.material,
      project_name: item.projectName,
      quantity: item.quantity,
      unit: item.unit,
      supplier: item.supplier,
      unit_price: item.unitPrice,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
      <PurchaseTable items={items} onUpdateStatus={updatePurchase} />
    </div>
  );
};

export default PurchasesPage;
