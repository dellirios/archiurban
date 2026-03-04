import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { type Lead, type LeadTemperature } from '@/data/crmMockData';

interface NewLeadModalProps {
  onAdd: (lead: Lead) => void;
}

const NewLeadModal = ({ onAdd }: NewLeadModalProps) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', origin: '', estimatedValue: '' });

  const handleSubmit = () => {
    if (!form.name) return;
    onAdd({
      id: crypto.randomUUID(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      origin: form.origin || 'Direto',
      estimatedValue: Number(form.estimatedValue) || 0,
      temperature: 'warm' as LeadTemperature,
      lastContact: new Date().toISOString().slice(0, 10),
      stage: 'new',
    });
    setForm({ name: '', email: '', phone: '', origin: '', estimatedValue: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Novo Lead
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo Lead</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="lead-name">Nome *</Label>
            <Input id="lead-name" placeholder="Nome do lead" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="lead-email">Email</Label>
              <Input id="lead-email" type="email" placeholder="email@exemplo.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-phone">Telefone</Label>
              <Input id="lead-phone" placeholder="(00) 00000-0000" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="lead-origin">Origem</Label>
              <Select value={form.origin} onValueChange={v => setForm(f => ({ ...f, origin: v }))}>
                <SelectTrigger id="lead-origin"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="Google">Google</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Indicação">Indicação</SelectItem>
                  <SelectItem value="Site">Site</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-value">Valor Estimado (R$)</Label>
              <Input id="lead-value" type="number" placeholder="0" value={form.estimatedValue} onChange={e => setForm(f => ({ ...f, estimatedValue: e.target.value }))} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <button onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
          <button onClick={handleSubmit} disabled={!form.name} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50">Adicionar</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewLeadModal;
