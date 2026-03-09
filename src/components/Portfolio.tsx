import { motion } from "framer-motion";
import { Monitor, Smartphone, BarChart3, MessageSquare, FolderKanban, Users } from "lucide-react";

const Portfolio = () => {
  const modules = [
    {
      icon: FolderKanban,
      title: "Dashboard & Kanban",
      description: "Visão centralizada de todos os projetos com quadro Kanban drag-and-drop, cronogramas e acompanhamento de progresso em tempo real.",
      features: ["Quadro Kanban", "Filtros por status", "Progresso automático", "Timeline"],
    },
    {
      icon: Users,
      title: "CRM & Leads",
      description: "Pipeline completo de vendas com funil visual, temperatura de leads, histórico de interações e acompanhamento de conversão.",
      features: ["Funil de vendas", "Temperatura", "Interações", "Conversão"],
    },
    {
      icon: BarChart3,
      title: "Finanças & Compras",
      description: "Controle de orçamento por projeto, requisições de compra de materiais, relatórios financeiros e KPIs do escritório.",
      features: ["Orçamentos", "Requisições", "KPIs", "Relatórios"],
    },
    {
      icon: MessageSquare,
      title: "Chat & Portal do Cliente",
      description: "Comunicação por projeto com clientes e equipe. Portal exclusivo para o cliente acompanhar fotos, documentos e atualizações.",
      features: ["Chat em tempo real", "Portal do cliente", "Notificações", "Histórico"],
    },
  ];

  return (
    <section id="work" className="py-24 lg:py-32 bg-background">
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
              Módulos
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
              Conheça cada módulo
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Todos os módulos integrados para que seu escritório funcione como uma máquina — 
              sem planilhas, sem WhatsApp, sem retrabalho.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {modules.map((mod, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group p-8 bg-card border border-border rounded-xl hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                  <mod.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{mod.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-5">{mod.description}</p>
                <div className="flex flex-wrap gap-2">
                  {mod.features.map((feat, i) => (
                    <span key={i} className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
                      {feat}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Responsive badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 flex items-center justify-center gap-6 text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              <span className="text-sm">Desktop</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm">Mobile-friendly</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
