import { CreditCard } from 'lucide-react';

const AdminBilling = () => (
  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
    <CreditCard className="w-10 h-10" />
    <h2 className="text-lg font-semibold text-foreground">Planos & Faturação</h2>
    <p className="text-sm">Em breve — gestão de planos e cobranças.</p>
  </div>
);

export default AdminBilling;
