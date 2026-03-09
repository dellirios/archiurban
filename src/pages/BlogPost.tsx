import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import { Loader2 } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const { data: post, isLoading, error } = useBlogPost(id || '');
  const { data: allPosts = [] } = useBlogPosts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-32 pb-32">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-light text-foreground mb-8">Post Não Encontrado</h1>
              <Link to="/blog" className="text-xs tracking-widest text-foreground hover:text-muted-foreground transition-colors">← VOLTAR AO BLOG</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const relatedPosts = allPosts.filter(p => p.slug !== post.slug && p.category === post.category).slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <article className="pt-32 pb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Link to="/blog" className="inline-block text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-12">← VOLTAR AO BLOG</Link>

            <div className="mb-8">
              <div className="flex items-center text-xs text-muted-foreground space-x-4 mb-6">
                <span className="bg-muted px-3 py-1 text-foreground">{post.category}</span>
                <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                <span>•</span>
                <span>{post.read_time}</span>
                <span>•</span>
                <span>{post.author}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-light text-foreground mb-6">{post.title}</h1>
              <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>
            </div>

            {post.image_url && (
              <div className="w-full h-96 mb-12 overflow-hidden">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <div
                className="text-muted-foreground leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .split('\n')
                    .map(line => {
                      if (line.startsWith('# ')) return `<h1 class="text-3xl md:text-4xl font-light text-foreground mb-8 mt-12">${line.substring(2)}</h1>`;
                      if (line.startsWith('## ')) return `<h2 class="text-2xl md:text-3xl font-light text-foreground mb-6 mt-10">${line.substring(3)}</h2>`;
                      if (line.startsWith('### ')) return `<h3 class="text-xl md:text-2xl font-medium text-foreground mb-4 mt-8">${line.substring(4)}</h3>`;
                      if (line.startsWith('- ')) return `<li class="ml-6 mb-2">${line.substring(2)}</li>`;
                      if (line.trim() === '') return '<br>';
                      return `<p class="mb-4">${line}</p>`;
                    })
                    .join('')
                }}
              />
            </div>

            <div className="mt-16 pt-8 border-t border-border">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-muted rounded-full" />
                <div>
                  <h3 className="text-lg font-medium text-foreground">{post.author}</h3>
                  <p className="text-muted-foreground">Arquiteto(a) & Escritor(a)</p>
                </div>
              </div>
            </div>

            {relatedPosts.length > 0 && (
              <div className="mt-20">
                <h3 className="text-2xl font-light text-foreground mb-8">Artigos Relacionados</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {relatedPosts.map(rp => (
                    <Link key={rp.id} to={`/blog/${rp.slug}`} className="group">
                      <div className="w-full h-48 mb-4 overflow-hidden">
                        <img src={rp.image_url || '/placeholder.svg'} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <h4 className="text-lg font-light text-foreground group-hover:text-muted-foreground transition-colors duration-300 mb-2">{rp.title}</h4>
                      <p className="text-xs text-muted-foreground">{new Date(rp.created_at).toLocaleDateString('pt-BR')} • {rp.read_time}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
