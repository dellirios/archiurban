import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Instagram, Linkedin, Globe, ImageIcon, Loader2, Mail } from 'lucide-react';

interface TenantPublic {
  id: string;
  name: string;
  logo: string | null;
  logo_url: string;
  primary_color: string | null;
  accent_color: string;
  bio: string;
  hero_headline: string;
  hero_subheadline: string;
  instagram: string;
  linkedin: string;
  website: string;
}

interface GalleryImage {
  url: string;
  caption: string;
}

interface ProjectPublic {
  id: string;
  name: string;
  description: string | null;
  client_name: string | null;
  status: string;
  photos: any;
  cover_image_url: string | null;
  gallery: GalleryImage[];
}

const useScrollReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

const ScrollReveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

const PublicPortfolioPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tenant, setTenant] = useState<TenantPublic | null>(null);
  const [projects, setProjects] = useState<ProjectPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [selectedProject, setSelectedProject] = useState<ProjectPublic | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!slug) { setNotFound(true); setLoading(false); return; }

      const { data: tenantData } = await supabase
        .from('tenants')
        .select('id, name, logo, logo_url, primary_color, accent_color, bio, hero_headline, hero_subheadline, instagram, linkedin, website')
        .eq('slug', slug)
        .maybeSingle();

      if (!tenantData) { setNotFound(true); setLoading(false); return; }
      setTenant(tenantData as any);

      const { data: projData } = await supabase
        .from('projects')
        .select('id, name, description, client_name, status, photos, cover_image_url, gallery')
        .eq('tenant_id', tenantData.id)
        .eq('is_portfolio_public', true)
        .order('created_at', { ascending: false });

      setProjects((projData as any[])?.map(p => ({
        ...p,
        gallery: Array.isArray(p.gallery) ? p.gallery : [],
      })) || []);
      setLoading(false);
    };
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (notFound || !tenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-neutral-400 gap-4">
        <Building2 className="w-12 h-12" />
        <h1 className="text-xl font-semibold text-white">Portfólio não encontrado</h1>
        <p className="text-sm">O escritório que você procura não existe ou ainda não publicou seu portfólio.</p>
      </div>
    );
  }

  const accent = tenant.accent_color || '#c89b3c';
  const primary = tenant.primary_color || '#1e3a5f';
  const heroImage = projects[0]?.cover_image_url;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 font-sans">
      {/* ── PARALLAX HERO ── */}
      <div ref={heroRef} className="relative h-screen overflow-hidden flex items-center justify-center">
        {/* Background parallax layer */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-none"
          style={{
            backgroundImage: heroImage ? `url(${heroImage})` : `linear-gradient(135deg, ${primary}, #0a0a0a)`,
            transform: `translateY(${scrollY * 0.4}px) scale(1.1)`,
            filter: 'brightness(0.35)',
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#0a0a0a]" />

        {/* Content */}
        <div
          className="relative z-10 text-center px-6 max-w-3xl mx-auto"
          style={{ transform: `translateY(${scrollY * 0.15}px)`, opacity: Math.max(0, 1 - scrollY / 600) }}
        >
          {/* Logo */}
          {tenant.logo_url ? (
            <img src={tenant.logo_url} alt={tenant.name} className="w-20 h-20 mx-auto mb-6 rounded-2xl object-contain bg-white/10 p-2 backdrop-blur-sm" />
          ) : (
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-2xl font-bold backdrop-blur-sm"
              style={{ backgroundColor: `${accent}30`, color: accent, border: `1px solid ${accent}40` }}
            >
              {tenant.name.charAt(0)}
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
            {tenant.hero_headline || tenant.name}
          </h1>
          <p className="text-lg sm:text-xl text-neutral-300 max-w-xl mx-auto">
            {tenant.hero_subheadline || tenant.bio || 'Arquitetura & Design'}
          </p>

          {/* Social */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {tenant.instagram && (
              <a href={`https://instagram.com/${tenant.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/50 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {tenant.linkedin && (
              <a href={tenant.linkedin.startsWith('http') ? tenant.linkedin : `https://${tenant.linkedin}`} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/50 transition-all">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {tenant.website && (
              <a href={tenant.website.startsWith('http') ? tenant.website : `https://${tenant.website}`} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/50 transition-all">
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-2.5 bg-white/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* ── BIO SECTION ── */}
      {tenant.bio && (
        <ScrollReveal>
          <section className="max-w-3xl mx-auto px-6 py-20 text-center">
            <div className="w-12 h-[2px] mx-auto mb-8" style={{ backgroundColor: accent }} />
            <p className="text-lg leading-relaxed text-neutral-400">{tenant.bio}</p>
          </section>
        </ScrollReveal>
      )}

      {/* ── PROJECTS ── */}
      <ScrollReveal>
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase mb-10" style={{ color: accent }}>
            Projetos Selecionados
          </h2>

        {projects.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">
            <Building2 className="w-10 h-10 mx-auto mb-3" />
            <p className="text-sm">Nenhum projeto público disponível.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {projects.map((project, idx) => {
              const displayImage = project.cover_image_url || (Array.isArray(project.photos) ? project.photos[0]?.url : null);
              const isEven = idx % 2 === 0;
              return (
                <ScrollReveal key={project.id} delay={idx * 120}>
                  <div
                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center cursor-pointer group`}
                    onClick={() => project.gallery.length > 0 && setSelectedProject(project)}
                  >
                    {/* Image */}
                    <div className="flex-1 w-full overflow-hidden rounded-xl">
                      {displayImage ? (
                        <img
                          src={displayImage}
                          alt={project.name}
                          className="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full aspect-[16/10] bg-neutral-800 flex items-center justify-center rounded-xl">
                          <ImageIcon className="w-10 h-10 text-neutral-600" />
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className={`flex-1 space-y-3 ${isEven ? 'lg:pl-4' : 'lg:pr-4'}`}>
                      <h3 className="text-2xl font-semibold text-white group-hover:text-opacity-80 transition-colors">
                        {project.name}
                      </h3>
                      {project.description && (
                        <p className="text-sm text-neutral-400 leading-relaxed">{project.description}</p>
                      )}
                      {project.gallery.length > 0 && (
                        <p className="text-xs uppercase tracking-wider" style={{ color: accent }}>
                          Ver galeria ({project.gallery.length} fotos) →
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
        </section>
      </ScrollReveal>

      {/* ── GALLERY LIGHTBOX ── */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 bg-black/95 overflow-y-auto"
          onClick={() => setSelectedProject(null)}
        >
          <div className="max-w-5xl mx-auto px-6 py-12" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-white">{selectedProject.name}</h2>
              <button onClick={() => setSelectedProject(null)} className="text-neutral-400 hover:text-white text-sm">
                Fechar ✕
              </button>
            </div>
            <div className="space-y-6">
              {selectedProject.gallery.map((img, i) => (
                <div key={i} className="space-y-2">
                  <img src={img.url} alt={img.caption || ''} className="w-full rounded-lg" />
                  {img.caption && (
                    <p className="text-sm text-neutral-400 italic">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="border-t border-neutral-800 py-8 text-center">
        <p className="text-xs text-neutral-600">
          Portfólio criado com <span className="text-neutral-400 font-medium">ArchiUrban</span>
        </p>
      </footer>
    </div>
  );
};

export default PublicPortfolioPage;
