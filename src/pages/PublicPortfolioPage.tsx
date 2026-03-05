import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Instagram, Linkedin, Globe, MapPin, ImageIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TenantPublic {
  id: string;
  name: string;
  logo: string | null;
  primary_color: string | null;
  bio: string;
  instagram: string;
  linkedin: string;
  website: string;
}

interface ProjectPublic {
  id: string;
  name: string;
  description: string | null;
  client_name: string | null;
  status: string;
  photos: any;
  cover_image_url: string | null;
}

const PublicPortfolioPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tenant, setTenant] = useState<TenantPublic | null>(null);
  const [projects, setProjects] = useState<ProjectPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!slug) { setNotFound(true); setLoading(false); return; }

      const { data: tenantData } = await supabase
        .from('tenants')
        .select('id, name, logo, primary_color, bio, instagram, linkedin, website')
        .eq('slug', slug)
        .maybeSingle();

      if (!tenantData) { setNotFound(true); setLoading(false); return; }
      setTenant(tenantData as any);

      const { data: projData } = await supabase
        .from('projects')
        .select('id, name, description, client_name, status, photos, cover_image_url')
        .eq('tenant_id', tenantData.id)
        .eq('is_portfolio_public', true)
        .order('created_at', { ascending: false });

      setProjects((projData as ProjectPublic[]) || []);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (notFound || !tenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Building2 className="w-12 h-12 text-muted-foreground" />
        <h1 className="text-xl font-semibold text-foreground">Portfólio não encontrado</h1>
        <p className="text-sm text-muted-foreground">O escritório que você procura não existe ou ainda não publicou seu portfólio.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="border-b border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold text-white"
              style={{ backgroundColor: tenant.primary_color || '#1e3a5f' }}
            >
              {tenant.logo || tenant.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{tenant.name}</h1>
              <p className="text-sm text-muted-foreground">Arquitetura & Design</p>
            </div>
          </div>
          {(tenant.bio as any) && (
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">{tenant.bio}</p>
          )}
          <div className="flex items-center gap-3 mt-4">
            {tenant.instagram && (
              <a href={`https://instagram.com/${tenant.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {tenant.linkedin && (
              <a href={tenant.linkedin.startsWith('http') ? tenant.linkedin : `https://${tenant.linkedin}`} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {tenant.website && (
              <a href={tenant.website.startsWith('http') ? tenant.website : `https://${tenant.website}`} target="_blank" rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Projects */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Projetos ({projects.length})
        </h2>
        {projects.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Building2 className="w-10 h-10 mx-auto mb-3" />
            <p className="text-sm">Nenhum projeto público disponível ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => {
              const photos = Array.isArray(project.photos) ? project.photos : [];
              const displayImage = project.cover_image_url || photos[0]?.url;
              return (
                <div key={project.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-[16/10] bg-secondary/30 flex items-center justify-center relative overflow-hidden">
                    {displayImage ? (
                      <img src={displayImage} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    {project.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Portfólio criado com <span className="font-medium text-foreground">ArchiUrban</span>
        </p>
      </footer>
    </div>
  );
};

export default PublicPortfolioPage;
