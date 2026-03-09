import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  const benefits = [
    "Projetos organizados em Kanban",
    "CRM e funil de vendas integrado",
    "Portal exclusivo para clientes",
    "Relatórios financeiros em tempo real",
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-primary">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-primary-foreground/80">Plataforma SaaS para Arquitetura</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[1.1] mb-6">
              O sistema completo para
              <span className="block mt-2 text-primary-foreground/70">escritórios de arquitetura</span>
            </h1>

            <p className="text-lg text-primary-foreground/70 max-w-lg mb-8 leading-relaxed">
              Gerencie projetos, equipe, clientes, documentos e finanças em uma única plataforma 
              feita sob medida para arquitetos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                  <span className="text-sm text-primary-foreground/80">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-base px-8 h-12 gap-2 w-full sm:w-auto">
                  <LogIn className="h-4 w-4" />
                  Começar Grátis
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8 h-12 gap-2 w-full sm:w-auto">
                  Ver Planos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <p className="text-xs text-primary-foreground/40 mt-4">
              Sem cartão de crédito · Teste grátis por 14 dias
            </p>
          </motion.div>

          {/* Right - Platform preview mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Browser mockup */}
              <div className="bg-card rounded-xl shadow-2xl overflow-hidden border border-border">
                {/* Browser toolbar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted/80 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                  </div>
                  <div className="flex-1 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground text-center">
                    app.archiurban.com/dashboard
                  </div>
                </div>
                
                {/* Dashboard mockup content */}
                <div className="p-6 bg-background space-y-4">
                  {/* Top KPIs */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Projetos Ativos", value: "12", change: "+3" },
                      { label: "Receita Mensal", value: "R$ 84k", change: "+18%" },
                      { label: "Leads no CRM", value: "27", change: "+5" },
                    ].map((kpi, i) => (
                      <div key={i} className="bg-card border border-border rounded-lg p-3">
                        <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                        <p className="text-lg font-semibold text-foreground">{kpi.value}</p>
                        <p className="text-[10px] text-green-600">↑ {kpi.change}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mini Kanban */}
                  <div className="grid grid-cols-3 gap-2">
                    {["Em Briefing", "Em Projeto", "Em Obra"].map((col, i) => (
                      <div key={i} className="space-y-2">
                        <p className="text-[10px] font-medium text-muted-foreground">{col}</p>
                        {[1, 2].map((card) => (
                          <div key={card} className="bg-muted/50 rounded p-2 border border-border">
                            <div className="h-2 w-3/4 bg-muted-foreground/20 rounded" />
                            <div className="h-1.5 w-1/2 bg-muted-foreground/10 rounded mt-1" />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating notification card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -right-4 top-1/3 bg-card border border-border rounded-lg p-3 shadow-lg max-w-[180px]"
              >
                <p className="text-[10px] font-medium text-foreground">Novo lead no CRM</p>
                <p className="text-[10px] text-muted-foreground">Maria Silva · Residencial</p>
                <p className="text-[10px] text-primary mt-1">Agora mesmo</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
