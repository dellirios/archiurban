import { type Project, statusLabels } from '@/data/mockData';
import ProjectCard from './ProjectCard';

interface KanbanBoardProps {
  projects: Project[];
}

const columns: { key: Project['status']; label: string; color: string }[] = [
  { key: 'planning', label: 'Planejamento', color: 'border-t-sky-400' },
  { key: 'execution', label: 'Execução', color: 'border-t-violet-400' },
  { key: 'review', label: 'Revisão', color: 'border-t-amber-400' },
  { key: 'completed', label: 'Finalizado', color: 'border-t-emerald-400' },
];

const KanbanBoard = ({ projects }: KanbanBoardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {columns.map(col => {
        const colProjects = projects.filter(p => p.status === col.key);
        return (
          <div key={col.key} className="flex flex-col">
            <div className={`bg-card border border-border border-t-2 ${col.color} rounded-lg`}>
              <div className="px-4 py-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">{col.label}</h3>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {colProjects.length}
                </span>
              </div>
            </div>
            <div className="mt-3 space-y-3 min-h-[200px]">
              {colProjects.map(project => (
                <ProjectCard key={project.id} project={project} variant="kanban" />
              ))}
              {colProjects.length === 0 && (
                <div className="flex items-center justify-center h-32 border-2 border-dashed border-border rounded-lg">
                  <p className="text-xs text-muted-foreground">Nenhum projeto</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;
