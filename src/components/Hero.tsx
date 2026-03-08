import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
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
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-white text-architectural mb-8 reveal">
          ARQUITETURA
          <br />
          MINIMALISTA
        </h1>
        <p className="text-xl md:text-2xl text-white/80 font-light tracking-wide max-w-2xl mx-auto reveal-delayed">
          Criando espaços que inspiram através de design consciente e qualidade incomparável
        </p>
        <div className="mt-10 reveal-delayed">
          <Link to="/login">
            <Button size="lg" className="bg-white text-black hover:bg-white/90 text-base px-8 py-6 rounded-none tracking-widest font-light gap-3">
              <LogIn className="h-5 w-5" />
              ENTRAR
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
