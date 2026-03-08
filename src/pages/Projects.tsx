import { useState } from 'react';
import { Plus, LayoutGrid, List, Lock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import KanbanBoard from '@/components/archi/KanbanBoard';
import ProjectTable from '@/components/archi/ProjectTable';
import NewProjectModal from '@/components/archi/NewProjectModal';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Projects = () => {
  const { projects } = useApp();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [showNewProject, setShowNewProject] = useState(false);
  const { canCreateProject, projectsRemaining, limits, currentTier } = useSubscriptionLimits();

  const handleNewProject = () => {
    if (!canCreateProject) {
      toast.error(`Limite de ${limits.maxProjects} projetos atingido no plano ${currentTier}. Faça upgrade para criar mais projetos.`);
      return;
    }
    setShowNewProject(true);
  };

  return (
    <div className="space-y-6">
      {!canCreateProject && (
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
          <Lock className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-400">
            Limite de <span className="font-semibold">{limits.maxProjects} projetos</span> atingido no plano <span className="font-semibold capitalize">{currentTier}</span>.{' '}
            <a href="/admin/billing" className="underline font-medium hover:no-underline">Faça upgrade</a> para criar mais.
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projetos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {projects.length} projetos encontrados
            {limits.maxProjects !== Infinity && (
              <span className="ml-2 text-xs text-muted-foreground/70">
                ({projectsRemaining === 0 ? 'limite atingido' : `${projectsRemaining} restante${projectsRemaining !== 1 ? 's' : ''}`})
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-secondary rounded-lg p-0.5">
            <button onClick={() => setView('kanban')} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all', view === 'kanban' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
              <LayoutGrid className="w-3.5 h-3.5" /> Kanban
            </button>
            <button onClick={() => setView('list')} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all', view === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
              <List className="w-3.5 h-3.5" /> Lista
            </button>
          </div>
          <button
            onClick={handleNewProject}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm",
              canCreateProject
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {canCreateProject ? <Plus className="w-4 h-4" /> : <Lock className="w-4 h-4" />} Novo Projeto
          </button>
        </div>
      </div>

      {view === 'kanban' ? <KanbanBoard projects={projects} /> : <ProjectTable projects={projects} />}
      <NewProjectModal open={showNewProject} onClose={() => setShowNewProject(false)} />
    </div>
  );
};

export default Projects;
