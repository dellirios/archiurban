import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

const Portfolio = () => {
  const screenshots = [
    {
      image: project1,
      title: "DASHBOARD COMPLETO",
      category: "VISÃO GERAL",
      description: "Acompanhe todos os seus projetos, métricas de desempenho e atividades recentes em um painel centralizado"
    },
    {
      image: project2,
      title: "GESTÃO DE PROJETOS",
      category: "KANBAN & TIMELINE",
      description: "Organize tarefas em quadros Kanban, defina prazos e acompanhe o progresso de cada etapa da obra"
    },
    {
      image: project3,
      title: "PORTAL DO CLIENTE",
      category: "EXPERIÊNCIA DO CLIENTE",
      description: "Seus clientes acessam fotos, documentos e atualizações do projeto em um portal elegante e profissional"
    }
  ];

  return (
    <section id="work" className="py-32 bg-muted">
      <div className="container mx-auto px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <h2 className="text-minimal text-muted-foreground mb-4">PLATAFORMA</h2>
            <h3 className="text-4xl md:text-6xl font-light text-architectural mb-6">
              Conheça a Experiência
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interfaces limpas e intuitivas projetadas para que você foque no que importa: 
              seus projetos de arquitetura.
            </p>
          </div>
          
          <div className="space-y-24">
            {screenshots.map((item, index) => (
              <div key={index} className="group">
                <div className="relative overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-[60vh] object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-minimal text-white/70 mb-2">{item.category}</p>
                    <h4 className="text-2xl font-light text-white mb-2">
                      {item.title}
                    </h4>
                    <p className="text-white/80 max-w-lg">
                      {item.description}
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

export default Portfolio;
