import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-architecture.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Imagem de Fundo */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Sobreposição */}
      <div className="absolute inset-0 hero-overlay" />
      
      {/* Conteúdo */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white text-architectural mb-6 reveal">
          GESTÃO DE PROJETOS
          <br />
          <span className="text-white/70">PARA ARQUITETOS</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 font-light tracking-wide max-w-2xl mx-auto mb-4 reveal-delayed">
          A plataforma completa para escritórios de arquitetura gerenciarem projetos, 
          equipes, clientes e documentos — tudo em um só lugar.
        </p>
        <p className="text-sm md:text-base text-white/60 font-light tracking-wide max-w-xl mx-auto reveal-delayed">
          CRM integrado · Portfólio público · Chat com clientes · Controle financeiro
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 reveal-delayed">
          <Link to="/login">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 text-base px-8 py-6 rounded-none tracking-widest font-light gap-3">
              <LogIn className="h-5 w-5" />
              COMEÇAR AGORA
            </Button>
          </Link>
          <Link to="/pricing">
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 text-base px-8 py-6 rounded-none tracking-widest font-light gap-3">
              VER PLANOS
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Indicador de Rolagem */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 reveal-delayed">
        <div className="w-px h-16 bg-white/40" />
        <div className="text-minimal text-white/60 mt-4 rotate-90 origin-center">
          ROLE
        </div>
      </div>
    </section>
  );
};

export default Hero;
