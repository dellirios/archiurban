import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { mockProjects, mockSuppliers } from '@/data/purchasesMockData';

interface PurchaseDrawerProps {
  onAdd: (item: { material: string; projectName: string; quantity: number; unit: string; supplier: string; unitPrice: number }) => void;
}

const PurchaseDrawer = ({ onAdd }: PurchaseDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    material: '', projectName: '', quantity: '', unit: 'un', supplier: '', unitPrice: '',
  });

  const handleSubmit = () => {
    if (!form.material || !form.projectName) return;
    onAdd({
      material: form.material,
      projectName: form.projectName,
      quantity: Number(form.quantity) || 1,
      unit: form.unit,
      supplier: form.supplier,
      unitPrice: Number(form.unitPrice) || 0,
    });
    setForm({ material: '', projectName: '', quantity: '', unit: 'un', supplier: '', unitPrice: '' });
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="gap-1.5 text-xs">
          <Plus className="w-4 h-4" /> Nova Requisição
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Nova Requisição de Compra</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 py-6">
          <div className="space-y-1.5">
            <Label>Material/Item *</Label>
            <Input placeholder="Ex: Porcelanato 60x60" value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Obra/Projeto *</Label>
            <Select value={form.projectName} onValueChange={v => setForm(f => ({ ...f, projectName: v }))}>
              <SelectTrigger><SelectValue placeholder="Selecione a obra" /></SelectTrigger>
              <SelectContent>
                {mockProjects.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Quantidade</Label>
              <Input type="number" placeholder="0" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Unidade</Label>
              <Select value={form.unit} onValueChange={v => setForm(f => ({ ...f, unit: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['un', 'm²', 'm³', 'kg', 'rolo', 'saco', 'kit', 'cx'].map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Fornecedor</Label>
            <Select value={form.supplier} onValueChange={v => setForm(f => ({ ...f, supplier: v }))}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {mockSuppliers.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Valor Unitário (R$)</Label>
            <Input type="number" placeholder="0,00" value={form.unitPrice} onChange={e => setForm(f => ({ ...f, unitPrice: e.target.value }))} />
          </div>
        </div>
        <SheetFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!form.material || !form.projectName}>Adicionar</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default PurchaseDrawer;
