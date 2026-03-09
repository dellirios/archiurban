const About = () => {
  return (
    <section id="about" className="py-32 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">POR QUE NOS ESCOLHER</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                Feito Por Quem
                <br />
                Entende Arquitetura
              </h3>
              
              <div className="space-y-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Diferente de ferramentas genéricas de gestão, nossa plataforma foi 
                  projetada especificamente para o fluxo de trabalho de escritórios 
                  de arquitetura — do briefing ao habite-se.
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Centralize a gestão do seu escritório, reduza retrabalho e ofereça 
                  uma experiência profissional aos seus clientes com portal exclusivo, 
                  chat integrado e acompanhamento em tempo real.
                </p>
              </div>
            </div>
            
            <div className="space-y-12">
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">COMO FUNCIONA</h4>
                <div className="space-y-6">
                  <div className="border-l-2 border-primary pl-6">
                    <h5 className="text-lg font-medium mb-2">1. Cadastre seu escritório</h5>
                    <p className="text-muted-foreground">Crie sua conta, personalize seu ambiente e convide sua equipe</p>
                  </div>
                  <div className="border-l-2 border-primary pl-6">
                    <h5 className="text-lg font-medium mb-2">2. Gerencie projetos</h5>
                    <p className="text-muted-foreground">Crie projetos, organize arquivos, acompanhe cronogramas e orçamentos</p>
                  </div>
                  <div className="border-l-2 border-primary pl-6">
                    <h5 className="text-lg font-medium mb-2">3. Conecte seus clientes</h5>
                    <p className="text-muted-foreground">Convide clientes para acompanhar o progresso pelo portal exclusivo</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 border-t border-border">
                <div className="grid grid-cols-3 gap-8 text-center">
                  <div>
                    <p className="text-3xl font-light text-primary">100%</p>
                    <p className="text-minimal text-muted-foreground mt-1">NA NUVEM</p>
                  </div>
                  <div>
                    <p className="text-3xl font-light text-primary">24/7</p>
                    <p className="text-minimal text-muted-foreground mt-1">DISPONÍVEL</p>
                  </div>
                  <div>
                    <p className="text-3xl font-light text-primary">SSL</p>
                    <p className="text-minimal text-muted-foreground mt-1">SEGURO</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
