import { useState } from 'react';
import { type Project } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
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
  const { updateProjectStatus } = useApp();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, projectId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(projectId);
  };

  const handleDragOver = (e: React.DragEvent, colKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCol(colKey);
  };

  const handleDragLeave = () => setDragOverCol(null);

  const handleDrop = (e: React.DragEvent, newStatus: Project['status']) => {
    e.preventDefault();
    if (draggedId) {
      updateProjectStatus(draggedId, newStatus);
    }
    setDraggedId(null);
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
      {columns.map(col => {
        const colProjects = projects.filter(p => p.status === col.key);
        const isOver = dragOverCol === col.key;
        return (
          <div
            key={col.key}
            className="flex flex-col"
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.key)}
          >
            <div className={`bg-card border border-border border-t-2 ${col.color} rounded-lg`}>
              <div className="px-4 py-3 flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">{col.label}</h3>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {colProjects.length}
                </span>
              </div>
            </div>
            <div className={`mt-3 space-y-3 min-h-[200px] rounded-lg transition-colors ${isOver ? 'bg-primary/5 ring-2 ring-primary/20 ring-dashed' : ''}`}>
              {colProjects.map(project => (
                <div
                  key={project.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, project.id)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-grab active:cursor-grabbing ${draggedId === project.id ? 'opacity-40' : ''}`}
                >
                  <ProjectCard project={project} variant="kanban" />
                </div>
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
