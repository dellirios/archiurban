import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { useSuppliers, useAddSupplier } from '@/hooks/useSuppliers';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface PurchaseDrawerProps {
  onAdd: (item: { material: string; projectName: string; quantity: number; unit: string; supplier: string; unitPrice: number }) => void;
}

const PurchaseDrawer = ({ onAdd }: PurchaseDrawerProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    material: '', projectName: '', quantity: '', unit: 'un', supplier: '', unitPrice: '',
  });
  const [newSupplier, setNewSupplier] = useState('');

  const { data: suppliers = [], isLoading: loadingSuppliers } = useSuppliers();
  const addSupplier = useAddSupplier();
  const { profile } = useAuth();

  // Fetch real projects from Supabase
  const { data: projects = [] } = useQuery({
    queryKey: ['projects-list', profile?.tenant_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name')
        .order('name');
      if (error) throw error;
      return data || [];
    },
    enabled: !!profile?.tenant_id,
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

  const handleAddSupplier = async () => {
    if (!newSupplier.trim()) return;
    const result = await addSupplier.mutateAsync(newSupplier.trim());
    setForm(f => ({ ...f, supplier: result.name }));
    setNewSupplier('');
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
                {projects.map(p => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
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
            {loadingSuppliers ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Carregando...</div>
            ) : (
              <Select value={form.supplier} onValueChange={v => setForm(f => ({ ...f, supplier: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {suppliers.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            <div className="flex gap-2 mt-2">
              <Input placeholder="Novo fornecedor" value={newSupplier} onChange={e => setNewSupplier(e.target.value)} className="text-xs" />
              <Button size="sm" variant="outline" onClick={handleAddSupplier} disabled={addSupplier.isPending || !newSupplier.trim()}>
                {addSupplier.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
              </Button>
            </div>
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
