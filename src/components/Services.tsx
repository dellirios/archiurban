const Services = () => {
  const services = [
    {
      number: "01",
      title: "RESIDENCIAL",
      description: "Criando lares que refletem estilos de vida individuais mantendo a integridade arquitetônica"
    },
    {
      number: "02", 
      title: "COMERCIAL",
      description: "Projetando espaços funcionais que aprimoram ambientes empresariais e experiências dos usuários"
    },
    {
      number: "03",
      title: "RENOVAÇÃO",
      description: "Transformando estruturas existentes com sensibilidade contemporânea e práticas sustentáveis"
    },
    {
      number: "04",
      title: "CONSULTORIA",
      description: "Oferecendo orientação especializada em direção de design, planejamento e soluções arquitetônicas"
    }
  ];

  return (
    <section id="services" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-minimal text-muted-foreground mb-4">SERVIÇOS</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural">
              O Que Fazemos
            </h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-x-20 gap-y-16">
            {services.map((service, index) => (
              <div key={index} className="group">
                <div className="flex items-start space-x-6">
                  <span className="text-minimal text-muted-foreground font-medium">
                    {service.number}
                  </span>
                  <div>
                    <h4 className="text-2xl font-light mb-4 text-architectural group-hover:text-muted-foreground transition-colors duration-500">
                      {service.title}
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
