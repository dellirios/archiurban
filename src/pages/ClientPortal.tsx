import { Building2, LogOut, ArrowLeftRight } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import ArchiTopbar from '@/components/archi/ArchiTopbar';
import Timeline from '@/components/archi/Timeline';
import PhotoGallery from '@/components/archi/PhotoGallery';
import { statusLabels, statusColors, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

const ClientPortal = () => {
  const { currentTenant, tenantProjects, setViewMode } = useApp();

  // Client sees the first active project for this tenant
  const clientProject = tenantProjects.find(p => p.status !== 'completed') || tenantProjects[0];

  if (!clientProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum projeto encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">{currentTenant.name}</h1>
            <p className="text-[10px] text-muted-foreground">Portal do Cliente</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('architect')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Painel Arquiteto</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Project Overview */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Seu Projeto</p>
              <h2 className="text-xl font-semibold text-foreground">{clientProject.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{clientProject.description}</p>
            </div>
            <span className={cn('text-xs px-3 py-1 rounded-full font-medium flex-shrink-0', statusColors[clientProject.status])}>
              {statusLabels[clientProject.status]}
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Progresso</p>
              <p className="text-lg font-semibold text-foreground mt-1">{clientProject.progress}%</p>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-2">
                <div className="h-full bg-primary rounded-full" style={{ width: `${clientProject.progress}%` }} />
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Início</p>
              <p className="text-sm font-semibold text-foreground mt-1">
                {new Date(clientProject.startDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Previsão</p>
              <p className="text-sm font-semibold text-foreground mt-1">
                {new Date(clientProject.endDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Orçamento</p>
              <p className="text-sm font-semibold text-foreground mt-1">{formatCurrency(clientProject.budget)}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-6">Cronograma da Obra</h3>
          <Timeline stages={clientProject.stages} />
        </div>

        {/* Photo Gallery */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-semibold text-foreground mb-6">
            Diário de Obra
            <span className="text-xs text-muted-foreground font-normal ml-2">({clientProject.photos.length} fotos)</span>
          </h3>
          <PhotoGallery photos={clientProject.photos} />
        </div>
      </main>
    </div>
  );
};

export default ClientPortal;
