const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">FALE CONOSCO</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                Vamos Criar Algo
                <br />
                Extraordinário
              </h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">E-MAIL</h4>
                  <a href="mailto:hello@archstudio.com" className="text-xl hover:text-muted-foreground transition-colors duration-300">
                    hello@archstudio.com
                  </a>
                </div>
                
                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">TELEFONE</h4>
                  <a href="tel:+1234567890" className="text-xl hover:text-muted-foreground transition-colors duration-300">
                    +1 (234) 567-8900
                  </a>
                </div>
                
                <div>
                  <h4 className="text-minimal text-muted-foreground mb-2">ESTÚDIO</h4>
                  <address className="text-xl not-italic">
                    123 Design Avenue
                    <br />
                    Nova York, NY 10001
                  </address>
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">SIGA-NOS</h4>
                <div className="space-y-4">
                  <a href="#" className="block text-xl hover:text-muted-foreground transition-colors duration-300">
                    Instagram
                  </a>
                  <a href="#" className="block text-xl hover:text-muted-foreground transition-colors duration-300">
                    LinkedIn
                  </a>
                  <a href="#" className="block text-xl hover:text-muted-foreground transition-colors duration-300">
                    Behance
                  </a>
                </div>
              </div>
              
              <div className="pt-12 border-t border-border">
                <p className="text-muted-foreground">
                  Abordamos cada projeto com curiosidade, rigor e compromisso com a excelência. 
                  Nosso processo começa ouvindo, entendendo sua visão e traduzindo-a 
                  em espaços que superam expectativas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
