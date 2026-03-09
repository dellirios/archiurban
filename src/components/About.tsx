import { motion } from "framer-motion";
import { Building2, Users, FolderOpen } from "lucide-react";

const About = () => {
  const steps = [
    {
      icon: Building2,
      step: "01",
      title: "Crie seu escritório",
      description: "Cadastre-se, personalize seu ambiente e convide os membros da equipe com diferentes níveis de acesso.",
    },
    {
      icon: FolderOpen,
      step: "02",
      title: "Gerencie tudo em um lugar",
      description: "Crie projetos, organize arquivos, acompanhe cronogramas, orçamentos e converse com clientes.",
    },
    {
      icon: Users,
      step: "03",
      title: "Conecte seus clientes",
      description: "Convide clientes para acompanhar o progresso pelo portal exclusivo com fotos, documentos e chat.",
    },
  ];

  return (
    <section id="about" className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-xs font-medium tracking-widest text-primary uppercase mb-3 bg-primary/5 px-4 py-1.5 rounded-full">
                Como funciona
              </span>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                3 passos para modernizar seu escritório
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                Diferente de ferramentas genéricas, o ArchiUrban foi projetado para o fluxo de trabalho 
                real de escritórios de arquitetura — do briefing ao habite-se.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Centralize gestão, reduza retrabalho e ofereça uma experiência profissional 
                aos seus clientes com portal exclusivo e acompanhamento em tempo real.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-border">
                {[
                  { value: "100%", label: "Na nuvem" },
                  { value: "24/7", label: "Disponível" },
                  { value: "SSL", label: "Seguro" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-bold text-primary">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right - Steps */}
            <div className="space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative flex gap-5 p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
                >
                  <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-primary">{step.step}</span>
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
