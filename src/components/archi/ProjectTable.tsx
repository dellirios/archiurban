import { type Project, statusLabels, statusColors, priorityLabels, priorityColors, formatCurrency } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface ProjectTableProps {
  projects: Project[];
}

const ProjectTable = ({ projects }: ProjectTableProps) => {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Projeto</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Cliente</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Status</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Prioridade</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Progresso</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Orçamento</th>
              <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Prazo</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{project.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{project.description}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                      {project.clientAvatar}
                    </div>
                    <span className="text-sm text-foreground">{project.clientName}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('text-xs px-2 py-1 rounded-full font-medium', statusColors[project.status])}>
                    {statusLabels[project.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn('text-xs px-2 py-1 rounded-full font-medium', priorityColors[project.priority])}>
                    {priorityLabels[project.priority]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{project.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-foreground">{formatCurrency(project.budget)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-muted-foreground">
                    {new Date(project.endDate).toLocaleDateString('pt-BR')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
