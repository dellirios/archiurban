import { useState } from 'react';
import { Briefcase, ExternalLink, Copy, Check, Instagram, Linkedin, Globe, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { portfolioProjects } from '@/data/reportsMockData';
import { useApp } from '@/contexts/AppContext';

const PortfolioPage = () => {
  const { currentTenant } = useApp();
  const slug = currentTenant.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const publicUrl = `archiurban.com.br/p/${slug}`;
  const [copied, setCopied] = useState(false);
  const [projects, setProjects] = useState(portfolioProjects);

  const [profile, setProfile] = useState({
    bio: 'Escritório de arquitetura focado em projetos residenciais e comerciais de alto padrão, com ênfase em sustentabilidade e design contemporâneo.',
    instagram: '',
    linkedin: '',
    website: '',
  });

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${publicUrl}`);
    setCopied(true);
    toast.success('Link copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const togglePublic = (id: string) => {
    setProjects(prev =>
      prev.map(p => (p.id === id ? { ...p, isPublic: !p.isPublic } : p))
    );
  };

  const publicCount = projects.filter(p => p.isPublic).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-primary" />
            Meu Portfólio Digital
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gerencie sua vitrine pública para atrair novos clientes
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-xs text-muted-foreground gap-2">
            <Globe className="w-3.5 h-3.5" />
            <span className="truncate max-w-[200px]">{publicUrl}</span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={copyLink}>
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            </Button>
          </div>
          <Button size="sm" className="gap-1.5 text-xs">
            <ExternalLink className="w-3.5 h-3.5" /> Ver Página Pública
          </Button>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Configurações do Perfil</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Bio do Escritório</Label>
            <Textarea
              rows={3}
              value={profile.bio}
              onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              placeholder="Descreva seu escritório em poucas linhas..."
              className="text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Instagram className="w-3.5 h-3.5" /> Instagram</Label>
            <Input
              placeholder="@seuescritorio"
              value={profile.instagram}
              onChange={e => setProfile(p => ({ ...p, instagram: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</Label>
            <Input
              placeholder="linkedin.com/company/..."
              value={profile.linkedin}
              onChange={e => setProfile(p => ({ ...p, linkedin: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website</Label>
            <Input
              placeholder="www.seusite.com.br"
              value={profile.website}
              onChange={e => setProfile(p => ({ ...p, website: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <Button size="sm" className="text-xs">Salvar Configurações</Button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">
            Projetos Finalizados
            <span className="text-muted-foreground font-normal ml-2">
              {publicCount} de {projects.length} públicos
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              className={`bg-card border rounded-xl overflow-hidden transition-all hover:shadow-md group ${
                project.isPublic ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border'
              }`}
            >
              <div className="relative aspect-[16/10] bg-secondary/30 flex items-center justify-center">
                <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                {project.isPublic && (
                  <Badge className="absolute top-2 right-2 text-[10px] bg-primary text-primary-foreground">
                    Público
                  </Badge>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {project.client} · {project.area} · {project.year}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Exibir no Portfólio</span>
                  <Switch
                    checked={project.isPublic}
                    onCheckedChange={() => togglePublic(project.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;
