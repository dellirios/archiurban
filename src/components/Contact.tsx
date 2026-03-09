import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <section id="contact" className="py-24 lg:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-primary rounded-2xl p-10 md:p-16 overflow-hidden"
          >
            {/* Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            }} />

            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Pronto para transformar seu escritório?
              </h2>
              <p className="text-lg text-primary-foreground/70 mb-8">
                Junte-se a escritórios que já modernizaram sua gestão com o ArchiUrban.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm text-primary-foreground/80">
                {["14 dias grátis", "Sem cartão de crédito", "Cancele quando quiser"].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 h-12 px-8 gap-2 w-full sm:w-auto">
                    Criar Conta Grátis
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 h-12 px-8 w-full sm:w-auto">
                    Ver Planos
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 ArchiUrban. Plataforma de gestão para escritórios de arquitetura.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="mailto:contato@archiurban.com" className="hover:text-foreground transition-colors">
                contato@archiurban.com
              </a>
              <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
              <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
