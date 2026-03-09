import { FolderKanban, Users, FileText, BarChart3, MessageSquare, Globe, Layout, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const Services = () => {
  const features = [
    {
      icon: FolderKanban,
      title: "Gestão de Projetos",
      description: "Quadro Kanban com etapas personalizáveis, cronograma, progresso e prioridades para cada obra.",
      highlight: true,
    },
    {
      icon: Users,
      title: "CRM & Funil de Vendas",
      description: "Pipeline de leads com temperatura, histórico de interações e conversão automatizada.",
      highlight: false,
    },
    {
      icon: FileText,
      title: "Documentos & Arquivos",
      description: "Upload de plantas, contratos e fotos organizados por projeto com pastas e versionamento.",
      highlight: false,
    },
    {
      icon: BarChart3,
      title: "Relatórios Financeiros",
      description: "Dashboard com KPIs, controle de orçamento por projeto e requisições de compra de materiais.",
      highlight: true,
    },
    {
      icon: MessageSquare,
      title: "Chat por Projeto",
      description: "Comunicação direta com clientes e equipe em cada projeto, com histórico completo.",
      highlight: false,
    },
    {
      icon: Globe,
      title: "Portfólio Público",
      description: "Página personalizada com seus melhores projetos para compartilhar com potenciais clientes.",
      highlight: false,
    },
    {
      icon: Layout,
      title: "Templates Reutilizáveis",
      description: "Modelos prontos de projetos, checklists e documentos para padronizar seus processos.",
      highlight: false,
    },
    {
      icon: ShieldCheck,
      title: "Multi-Tenant Seguro",
      description: "Cada escritório opera em ambiente isolado com controle de acesso por função e convites.",
      highlight: true,
    },
  ];

  return (
    <section id="services" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-xs font-medium tracking-widest text-primary uppercase mb-3 bg-primary/5 px-4 py-1.5 rounded-full">
              Funcionalidades
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Tudo que seu escritório precisa
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Do primeiro contato com o cliente até a entrega final — uma plataforma feita 
              para a rotina real de escritórios de arquitetura.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className={`group relative p-6 rounded-xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  feature.highlight 
                    ? "bg-primary text-primary-foreground border-primary" 
                    : "bg-card border-border hover:border-primary/30"
                }`}
              >
                <feature.icon className={`h-8 w-8 mb-4 ${feature.highlight ? "text-primary-foreground/80" : "text-primary"}`} />
                <h3 className={`font-semibold mb-2 ${feature.highlight ? "text-primary-foreground" : "text-foreground"}`}>
                  {feature.title}
                </h3>
                <p className={`text-sm leading-relaxed ${feature.highlight ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
