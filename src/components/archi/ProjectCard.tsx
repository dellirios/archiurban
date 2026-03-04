import { useNavigate } from 'react-router-dom';
import { type Project, priorityLabels, priorityColors } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Calendar } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  variant?: 'kanban' | 'list';
}

const ProjectCard = ({ project, variant = 'kanban' }: ProjectCardProps) => {
  const navigate = useNavigate();

  if (variant === 'kanban') {
    return (
      <div
        onClick={() => navigate(`/app/projects/${project.id}`)}
        className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {project.name}
          </h4>
          <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ml-2', priorityColors[project.priority])}>
            {priorityLabels[project.priority]}
          </span>
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{project.description}</p>

        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>Progresso</span>
            <span className="font-medium text-foreground">{project.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
              {project.clientAvatar}
            </div>
            <span className="text-xs text-muted-foreground">{project.clientName}</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{new Date(project.endDate).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' })}</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProjectCard;
