import { Building2, LogOut } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import Timeline from '@/components/archi/Timeline';
import PhotoGallery from '@/components/archi/PhotoGallery';
import ProjectChat from '@/components/archi/ProjectChat';
import { statusLabels, statusColors, formatCurrency } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const ClientPortal = () => {
  const { currentTenant, projects } = useApp();
  const { user, profile, signOut } = useAuth();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Filter projects by client name/email match
  const clientName = profile?.full_name?.toLowerCase() || '';
  const clientEmail = user?.email?.toLowerCase() || '';
  const clientProjects = projects.filter(p =>
    (p.client_name && p.client_name.toLowerCase().includes(clientName)) ||
    (p.client_email && p.client_email.toLowerCase() === clientEmail)
  );

  const visibleProjects = clientProjects.length > 0 ? clientProjects : projects;
  const currentProject = selectedProjectId
    ? visibleProjects.find(p => p.id === selectedProjectId) || visibleProjects[0]
    : visibleProjects.find(p => p.status !== 'completed') || visibleProjects[0];

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Nenhum projeto encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center"><Building2 className="w-5 h-5 text-primary-foreground" /></div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">{currentTenant.name}</h1>
            <p className="text-[10px] text-muted-foreground">Portal do Cliente</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {profile?.full_name && <span className="text-sm text-muted-foreground hidden sm:inline">Olá, {profile.full_name.split(' ')[0]}</span>}
          <button onClick={signOut} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
            <LogOut className="w-4 h-4" /><span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {visibleProjects.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {visibleProjects.map(p => (
              <button key={p.id} onClick={() => setSelectedProjectId(p.id)} className={cn('px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors', currentProject.id === p.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-accent')}>{p.name}</button>
            ))}
          </div>
        )}

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Seu Projeto</p>
              <h2 className="text-xl font-semibold text-foreground">{currentProject.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{currentProject.description}</p>
            </div>
            <span className={cn('text-xs px-3 py-1 rounded-full font-medium flex-shrink-0', statusColors[currentProject.status])}>{statusLabels[currentProject.status]}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Progresso</p>
              <p className="text-lg font-semibold text-foreground mt-1">{currentProject.progress}%</p>
              <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden mt-2"><div className="h-full bg-primary rounded-full" style={{ width: `${currentProject.progress}%` }} /></div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Início</p>
              <p className="text-sm font-semibold text-foreground mt-1">{currentProject.start_date ? new Date(currentProject.start_date).toLocaleDateString('pt-BR') : '—'}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Previsão</p>
              <p className="text-sm font-semibold text-foreground mt-1">{currentProject.end_date ? new Date(currentProject.end_date).toLocaleDateString('pt-BR') : '—'}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Orçamento</p>
              <p className="text-sm font-semibold text-foreground mt-1">{formatCurrency(currentProject.budget)}</p>
            </div>
          </div>
        </div>

        {currentProject.stages.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6">Cronograma da Obra</h3>
            <Timeline stages={currentProject.stages} />
          </div>
        )}

        {currentProject.photos.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6">Diário de Obra ({currentProject.photos.length} fotos)</h3>
            <PhotoGallery photos={currentProject.photos} />
          </div>
        )}

        <ProjectChat projectId={currentProject.id} />
      </main>
    </div>
  );
};

export default ClientPortal;
