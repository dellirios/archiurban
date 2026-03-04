import { useApp } from '@/contexts/AppContext';
import { Mail, Phone } from 'lucide-react';

const Clients = () => {
  const { tenantClients } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
        <p className="text-sm text-muted-foreground mt-1">{tenantClients.length} clientes cadastrados</p>
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          {tenantClients.map(client => (
            <div key={client.id} className="px-5 py-4 flex items-center gap-4 hover:bg-accent/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">
                {client.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{client.name}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {client.email}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {client.phone}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clients;
