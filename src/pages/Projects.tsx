import { useState } from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import KanbanBoard from '@/components/archi/KanbanBoard';
import ProjectTable from '@/components/archi/ProjectTable';
import { cn } from '@/lib/utils';

const Projects = () => {
  const { tenantProjects } = useApp();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Projetos</h1>
          <p className="text-sm text-muted-foreground mt-1">{tenantProjects.length} projetos encontrados</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Tabs */}
          <div className="flex bg-secondary rounded-lg p-0.5">
            <button
              onClick={() => setView('kanban')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                view === 'kanban' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setView('list')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                view === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="w-3.5 h-3.5" />
              Lista
            </button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Novo Projeto
          </button>
        </div>
      </div>

      {/* Content */}
      {view === 'kanban' ? (
        <KanbanBoard projects={tenantProjects} />
      ) : (
        <ProjectTable projects={tenantProjects} />
      )}
    </div>
  );
};

export default Projects;
