import { useState, useEffect, useRef } from 'react';
import { Briefcase, ExternalLink, Copy, Check, Instagram, Linkedin, Globe, ImageIcon, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { usePortfolio } from '@/hooks/usePortfolio';

const PortfolioPage = () => {
  const { projects, tenantProfile, loading, toggleProjectPublic, updateTenantProfile, uploadCoverImage } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  const slug = tenantProfile?.slug || '';
  const publicUrl = `archiurban.com.br/p/${slug}`;

  const [profile, setProfile] = useState({
    bio: '',
    instagram: '',
    linkedin: '',
    website: '',
  });

  // Sync from DB once loaded
  useEffect(() => {
    if (tenantProfile) {
      setProfile({
        bio: tenantProfile.bio || '',
        instagram: tenantProfile.instagram || '',
        linkedin: tenantProfile.linkedin || '',
        website: tenantProfile.website || '',
      });
    }
  }, [tenantProfile]);

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${publicUrl}`);
    setCopied(true);
    toast.success('Link copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    await updateTenantProfile(profile);
    setSaving(false);
    toast.success('Perfil atualizado!');
  };

  const publicCount = projects.filter((p: any) => p.is_portfolio_public).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

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
          {slug && (
            <div className="flex items-center bg-secondary/50 border border-border rounded-lg px-3 py-1.5 text-xs text-muted-foreground gap-2">
              <Globe className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{publicUrl}</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={copyLink}>
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </Button>
            </div>
          )}
          <Button size="sm" className="gap-1.5 text-xs" asChild>
            <a href={`/p/${slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5" /> Ver Página Pública
            </a>
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
            <Button size="sm" className="text-xs" onClick={handleSaveProfile} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
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
        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Briefcase className="w-10 h-10 mb-2" />
            <p className="text-sm">Nenhum projeto finalizado encontrado</p>
            <p className="text-xs mt-1">Finalize projetos para exibi-los no portfólio</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.map((project: any) => {
              const coverUrl = project.cover_image_url || null;
              const photos = Array.isArray(project.photos) ? project.photos : [];
              const displayImage = coverUrl || photos[0]?.url;

              const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                if (file) uploadCoverImage(project.id, file);
                e.target.value = '';
              };

              return (
                <div
                  key={project.id}
                  className={`bg-card border rounded-xl overflow-hidden transition-all hover:shadow-md group ${
                    project.is_portfolio_public ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border'
                  }`}
                >
                  <div className="relative aspect-[16/10] bg-secondary/30 flex items-center justify-center overflow-hidden">
                    {displayImage ? (
                      <img src={displayImage} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                    )}
                    {/* Upload overlay */}
                    <label className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors cursor-pointer">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-1 text-white">
                        <Upload className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Alterar capa</span>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    {project.is_portfolio_public && (
                      <Badge className="absolute top-2 right-2 text-[10px] bg-primary text-primary-foreground z-10">
                        Público
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {project.client_name || 'Sem cliente'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">Exibir no Portfólio</span>
                      <Switch
                        checked={project.is_portfolio_public}
                        onCheckedChange={(checked) => toggleProjectPublic(project.id, checked)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
