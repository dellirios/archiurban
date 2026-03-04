import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Users, FileText, Camera, TrendingUp, FolderOpen } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency, statusLabels, statusColors, priorityLabels, priorityColors } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Timeline from '@/components/archi/Timeline';
import PhotoGallery from '@/components/archi/PhotoGallery';
import ProjectChat from '@/components/archi/ProjectChat';
import FileExplorer from '@/components/archi/FileExplorer';
import { cn } from '@/lib/utils';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects } = useApp();
  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted-foreground">Projeto não encontrado</p>
        <button onClick={() => navigate('/app/projects')} className="text-primary text-sm hover:underline">Voltar aos projetos</button>
      </div>
    );
  }

  const daysRemaining = project.end_date ? Math.max(0, Math.ceil((new Date(project.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : 0;
  const budgetSpent = project.budget * (project.progress / 100);

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <button onClick={() => navigate('/app/projects')} className="mt-1 p-1.5 rounded-lg hover:bg-secondary transition-colors">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-semibold text-foreground">{project.name}</h1>
            <span className={cn('text-xs px-2.5 py-0.5 rounded-full font-medium', statusColors[project.status])}>{statusLabels[project.status]}</span>
            <span className={cn('text-xs px-2.5 py-0.5 rounded-full font-medium', priorityColors[project.priority])}>{priorityLabels[project.priority]}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Cliente', value: project.client_name || '—' },
          { icon: Calendar, label: 'Prazo', value: `${daysRemaining} dias restantes` },
          { icon: DollarSign, label: 'Orçamento', value: formatCurrency(project.budget) },
          { icon: TrendingUp, label: 'Progresso', value: `${project.progress}%` },
        ].map(stat => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <stat.icon className="w-4 h-4" />
              <span className="text-xs">{stat.label}</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="timeline">Cronograma</TabsTrigger>
          <TabsTrigger value="photos">Fotos</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="files">Arquivos</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Detalhes do Projeto</h3>
              <div className="space-y-3 text-sm">
                {[
                  ['Início', project.start_date ? new Date(project.start_date).toLocaleDateString('pt-BR') : '—'],
                  ['Previsão de Entrega', project.end_date ? new Date(project.end_date).toLocaleDateString('pt-BR') : '—'],
                  ['Status', statusLabels[project.status]],
                  ['Prioridade', priorityLabels[project.priority]],
                  ['Orçamento', formatCurrency(project.budget)],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Progresso das Etapas</h3>
              {project.stages.length > 0 ? <Timeline stages={project.stages} /> : <p className="text-sm text-muted-foreground">Nenhuma etapa cadastrada</p>}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6">Cronograma Completo</h3>
            {project.stages.length > 0 ? <Timeline stages={project.stages} /> : <p className="text-sm text-muted-foreground">Nenhuma etapa cadastrada</p>}
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6">Galeria de Fotos ({project.photos.length})</h3>
            {project.photos.length > 0 ? <PhotoGallery photos={project.photos} /> : <p className="text-sm text-muted-foreground">Nenhuma foto adicionada</p>}
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <ProjectChat projectId={project.id} />
        </TabsContent>

        <TabsContent value="files">
          <div className="bg-card border border-border rounded-xl p-6">
            <FileExplorer />
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-semibold text-foreground">Resumo Financeiro</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Orçamento Total', value: formatCurrency(project.budget), color: 'text-foreground' },
                { label: 'Gasto Estimado', value: formatCurrency(budgetSpent), color: 'text-amber-600' },
                { label: 'Saldo Restante', value: formatCurrency(project.budget - budgetSpent), color: 'text-emerald-600' },
              ].map(item => (
                <div key={item.label} className="p-4 border border-border rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                  <p className={cn('text-lg font-bold', item.color)}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
