import { FolderKanban, Users, FileText, BarChart3, MessageSquare, Layout, ShieldCheck, Globe } from "lucide-react";

const Services = () => {
  const features = [
    {
      icon: FolderKanban,
      title: "GESTÃO DE PROJETOS",
      description: "Kanban, cronogramas e acompanhamento de progresso para cada obra e projeto do escritório"
    },
    {
      icon: Users,
      title: "CRM INTEGRADO",
      description: "Pipeline de leads, funil de vendas e histórico de interações para converter mais clientes"
    },
    {
      icon: FileText,
      title: "DOCUMENTOS & ARQUIVOS",
      description: "Organize plantas, contratos e documentos por projeto com controle de versão e acesso"
    },
    {
      icon: BarChart3,
      title: "RELATÓRIOS & FINANÇAS",
      description: "Dashboards com KPIs, controle de orçamento e requisições de compra de materiais"
    },
    {
      icon: MessageSquare,
      title: "CHAT COM CLIENTES",
      description: "Comunicação direta por projeto com histórico completo e notificações em tempo real"
    },
    {
      icon: Globe,
      title: "PORTFÓLIO PÚBLICO",
      description: "Página personalizada para exibir seus melhores projetos e atrair novos clientes"
    },
    {
      icon: Layout,
      title: "TEMPLATES",
      description: "Modelos reutilizáveis de projetos, checklists e documentos para padronizar processos"
    },
    {
      icon: ShieldCheck,
      title: "MULTI-TENANT",
      description: "Cada escritório tem seu ambiente isolado e seguro com controle de acesso por função"
    }
  ];

  return (
    <section id="services" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-minimal text-muted-foreground mb-4">FUNCIONALIDADES</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural mb-6">
              Tudo Que Seu Escritório Precisa
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma pensada para a rotina de escritórios de arquitetura, 
              do primeiro contato com o cliente até a entrega final do projeto.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group p-6 border border-border rounded-lg hover:border-primary/30 hover:bg-accent/50 transition-all duration-300">
                <feature.icon className="h-8 w-8 text-primary mb-4" />
                <h4 className="text-sm font-medium mb-3 tracking-wider text-foreground">
                  {feature.title}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
