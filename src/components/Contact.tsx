import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h2 className="text-minimal text-muted-foreground mb-4">COMECE AGORA</h2>
              <h3 className="text-4xl md:text-6xl font-light text-architectural mb-12">
                Transforme a Gestão
                <br />
                do Seu Escritório
              </h3>
              
              <div className="space-y-6 mb-10">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Junte-se a escritórios de arquitetura que já modernizaram sua gestão 
                  com nossa plataforma. Teste grátis por 14 dias, sem cartão de crédito.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button size="lg" className="rounded-none tracking-widest font-light gap-3 px-8 py-6">
                    CRIAR CONTA GRÁTIS
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="rounded-none tracking-widest font-light px-8 py-6">
                    VER PLANOS
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">CONTATO</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-minimal text-muted-foreground mb-1">E-MAIL</h5>
                    <a href="mailto:contato@archstudio.com" className="text-lg hover:text-muted-foreground transition-colors duration-300">
                      contato@archstudio.com
                    </a>
                  </div>
                  <div>
                    <h5 className="text-minimal text-muted-foreground mb-1">SUPORTE</h5>
                    <a href="mailto:suporte@archstudio.com" className="text-lg hover:text-muted-foreground transition-colors duration-300">
                      suporte@archstudio.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-minimal text-muted-foreground mb-6">REDES SOCIAIS</h4>
                <div className="space-y-3">
                  <a href="#" className="block text-lg hover:text-muted-foreground transition-colors duration-300">
                    Instagram
                  </a>
                  <a href="#" className="block text-lg hover:text-muted-foreground transition-colors duration-300">
                    LinkedIn
                  </a>
                </div>
              </div>
              
              <div className="pt-8 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  © 2024 Arch Studio. Plataforma de gestão para escritórios de arquitetura. 
                  Todos os direitos reservados.
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
