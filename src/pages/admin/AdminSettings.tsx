import { Settings } from 'lucide-react';

const AdminSettings = () => (
  <div className="flex flex-col items-center justify-center h-64 text-muted-foreground gap-3">
    <Settings className="w-10 h-10" />
    <h2 className="text-lg font-semibold text-foreground">Configurações</h2>
    <p className="text-sm">Em breve — configurações globais da plataforma.</p>
  </div>
);

export default AdminSettings;
