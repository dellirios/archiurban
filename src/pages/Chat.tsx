import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import ProjectChat from '@/components/archi/ProjectChat';
import { cn } from '@/lib/utils';

const Chat = () => {
  const { projects } = useApp();
  const { profile } = useAuth();

  const activeProjects = projects.filter(p => p.status !== 'completed');

  if (activeProjects.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">Chat</h1>
        <p className="text-sm text-muted-foreground">Nenhum projeto ativo para iniciar uma conversa.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Chat</h1>
        <p className="text-sm text-muted-foreground mt-1">Selecione um projeto para conversar</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-2">
          {activeProjects.map((p, i) => (
            <a
              key={p.id}
              href={`/app/projects/${p.id}`}
              className="block bg-card border border-border rounded-xl p-4 hover:bg-accent/30 transition-colors"
            >
              <p className="text-sm font-medium text-foreground">{p.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{p.client_name || 'Sem cliente'}</p>
            </a>
          ))}
        </div>
        <div className="lg:col-span-2">
          <ProjectChat projectId={activeProjects[0].id} />
        </div>
      </div>
    </div>
  );
};

export default Chat;
