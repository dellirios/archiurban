import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, DollarSign, Users, FileText, Camera, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { formatCurrency, statusLabels, statusColors, priorityLabels, priorityColors } from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Timeline from '@/components/archi/Timeline';
import PhotoGallery from '@/components/archi/PhotoGallery';
import { cn } from '@/lib/utils';

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { allProjects } = useApp();
  const project = allProjects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <p className="text-muted-foreground">Projeto não encontrado</p>
        <button onClick={() => navigate('/app/projects')} className="text-primary text-sm hover:underline">Voltar aos projetos</button>
      </div>
    );
  }

  const daysRemaining = Math.max(0, Math.ceil((new Date(project.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const budgetSpent = project.budget * (project.progress / 100);

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Cliente', value: project.clientName },
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

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="timeline">Cronograma</TabsTrigger>
          <TabsTrigger value="photos">Fotos</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="financial">Financeiro</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Detalhes do Projeto</h3>
              <div className="space-y-3 text-sm">
                {[
                  ['Início', new Date(project.startDate).toLocaleDateString('pt-BR')],
                  ['Previsão de Entrega', new Date(project.endDate).toLocaleDateString('pt-BR')],
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
              <Timeline stages={project.stages} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="timeline">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6">Cronograma Completo</h3>
            <Timeline stages={project.stages} />
          </div>
        </TabsContent>

        <TabsContent value="photos">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-foreground">Galeria de Fotos</h3>
              <span className="text-xs text-muted-foreground">{project.photos.length} fotos</span>
            </div>
            <PhotoGallery photos={project.photos} />
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Documentos</h3>
            <div className="space-y-3">
              {[
                { name: 'Projeto Arquitetônico.pdf', size: '4.2 MB', date: project.startDate },
                { name: 'Memorial Descritivo.pdf', size: '1.8 MB', date: project.startDate },
                { name: 'Cronograma Executivo.xlsx', size: '520 KB', date: project.startDate },
                { name: 'ART - Anotação de Responsabilidade.pdf', size: '280 KB', date: project.startDate },
              ].map(doc => (
                <div key={doc.name} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/30 transition-colors cursor-pointer">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.size}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(doc.date).toLocaleDateString('pt-BR')}</span>
                </div>
              ))}
            </div>
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
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Execução do orçamento</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
