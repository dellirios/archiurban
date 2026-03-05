import { useState, useEffect } from 'react';
import {
  Briefcase, ExternalLink, Copy, Check, Instagram, Linkedin, Globe,
  ImageIcon, Loader2, Upload, Palette, Plus, X, Pencil, Image, Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { usePortfolio, type GalleryImage } from '@/hooks/usePortfolio';

const PortfolioPage = () => {
  const {
    projects, tenantProfile, loading,
    toggleProjectPublic, updateTenantProfile,
    uploadCoverImage, uploadLogo, uploadGalleryImage, updateGallery,
  } = usePortfolio();

  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [galleryProjectId, setGalleryProjectId] = useState<string | null>(null);
  const [editCaptions, setEditCaptions] = useState<GalleryImage[]>([]);

  const slug = tenantProfile?.slug || '';
  const publicUrl = `archiurban.com.br/p/${slug}`;

  const [profile, setProfile] = useState({
    bio: '', instagram: '', linkedin: '', website: '', phone: '',
    hero_headline: '', hero_subheadline: '', accent_color: '#c89b3c',
  });

  useEffect(() => {
    if (tenantProfile) {
      setProfile({
        bio: tenantProfile.bio || '',
        instagram: tenantProfile.instagram || '',
        linkedin: tenantProfile.linkedin || '',
        website: tenantProfile.website || '',
        phone: tenantProfile.phone || '',
        hero_headline: tenantProfile.hero_headline || '',
        hero_subheadline: tenantProfile.hero_subheadline || '',
        accent_color: tenantProfile.accent_color || '#c89b3c',
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadLogo(file);
    e.target.value = '';
  };

  const openGallery = (projectId: string) => {
    const proj = projects.find((p: any) => p.id === projectId);
    const gallery: GalleryImage[] = Array.isArray(proj?.gallery) ? proj.gallery : [];
    setEditCaptions(gallery.map(g => ({ ...g })));
    setGalleryProjectId(projectId);
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && galleryProjectId) uploadGalleryImage(galleryProjectId, file);
    e.target.value = '';
  };

  const removeGalleryImage = (idx: number) => {
    setEditCaptions(prev => prev.filter((_, i) => i !== idx));
  };

  const updateCaption = (idx: number, caption: string) => {
    setEditCaptions(prev => prev.map((g, i) => i === idx ? { ...g, caption } : g));
  };

  const saveGallery = async () => {
    if (!galleryProjectId) return;
    await updateGallery(galleryProjectId, editCaptions);
    toast.success('Galeria salva!');
    setGalleryProjectId(null);
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
            Personalize sua vitrine pública para atrair novos clientes
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

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="branding" className="text-xs gap-1.5"><Palette className="w-3.5 h-3.5" /> Identidade Visual</TabsTrigger>
          <TabsTrigger value="projects" className="text-xs gap-1.5"><Image className="w-3.5 h-3.5" /> Projetos ({projects.length})</TabsTrigger>
        </TabsList>

        {/* ── BRANDING TAB ── */}
        <TabsContent value="branding">
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            {/* Logo */}
            <div className="flex items-start gap-5">
              <div className="relative group">
                <div className="w-20 h-20 rounded-xl bg-secondary/50 border border-border flex items-center justify-center overflow-hidden">
                  {tenantProfile?.logo_url ? (
                    <img src={tenantProfile.logo_url} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <Briefcase className="w-8 h-8 text-muted-foreground/40" />
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-xl transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>
              <div className="flex-1 space-y-3">
                <div className="space-y-1.5">
                  <Label>Título do Hero</Label>
                  <Input
                    placeholder="Ex: Transformamos espaços em experiências"
                    value={profile.hero_headline}
                    onChange={e => setProfile(p => ({ ...p, hero_headline: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Subtítulo do Hero</Label>
                  <Input
                    placeholder="Ex: Arquitetura residencial e comercial de alto padrão"
                    value={profile.hero_subheadline}
                    onChange={e => setProfile(p => ({ ...p, hero_subheadline: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label>Cor de Destaque</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={profile.accent_color}
                    onChange={e => setProfile(p => ({ ...p, accent_color: e.target.value }))}
                    className="w-10 h-10 rounded-lg border border-border cursor-pointer"
                  />
                  <Input
                    value={profile.accent_color}
                    onChange={e => setProfile(p => ({ ...p, accent_color: e.target.value }))}
                    className="font-mono text-xs w-28"
                  />
                  {/* Preview */}
                  <div className="flex-1 h-10 rounded-lg" style={{ backgroundColor: profile.accent_color, opacity: 0.15 }} />
                </div>
              </div>
            </div>

            {/* Bio & Social */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5 md:col-span-2">
                <Label>Bio do Escritório</Label>
                <Textarea
                  rows={3}
                  value={profile.bio}
                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Descreva seu escritório..."
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Instagram className="w-3.5 h-3.5" /> Instagram</Label>
                <Input placeholder="@seuescritorio" value={profile.instagram} onChange={e => setProfile(p => ({ ...p, instagram: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</Label>
                <Input placeholder="linkedin.com/company/..." value={profile.linkedin} onChange={e => setProfile(p => ({ ...p, linkedin: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Website</Label>
                <Input placeholder="www.seusite.com.br" value={profile.website} onChange={e => setProfile(p => ({ ...p, website: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> WhatsApp</Label>
                <Input placeholder="+55 11 99999-9999" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                <p className="text-[10px] text-muted-foreground">Será exibido como botão flutuante na página pública</p>
              </div>
              <div className="flex items-end">
                <Button size="sm" className="text-xs" onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Salvando...' : 'Salvar Tudo'}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── PROJECTS TAB ── */}
        <TabsContent value="projects">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Briefcase className="w-10 h-10 mb-2" />
              <p className="text-sm">Nenhum projeto finalizado encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {projects.map((project: any) => {
                const coverUrl = project.cover_image_url || null;
                const photos = Array.isArray(project.photos) ? project.photos : [];
                const displayImage = coverUrl || photos[0]?.url;
                const galleryCount = Array.isArray(project.gallery) ? project.gallery.length : 0;

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
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-xs text-muted-foreground">{project.client_name || 'Sem cliente'}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" className="h-7 text-[11px] gap-1" onClick={() => openGallery(project.id)}>
                          <Image className="w-3 h-3" /> Galeria ({galleryCount})
                        </Button>
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
        </TabsContent>
      </Tabs>

      {/* Gallery Modal */}
      <Dialog open={!!galleryProjectId} onOpenChange={(open) => !open && setGalleryProjectId(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Galeria do Projeto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="flex items-center justify-center border-2 border-dashed border-border rounded-lg py-6 cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex flex-col items-center gap-1 text-muted-foreground">
                <Plus className="w-5 h-5" />
                <span className="text-xs">Adicionar foto à galeria</span>
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} />
            </label>

            {editCaptions.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">Nenhuma imagem na galeria</p>
            )}

            <div className="grid grid-cols-2 gap-3">
              {editCaptions.map((img, i) => (
                <div key={i} className="relative border border-border rounded-lg overflow-hidden">
                  <img src={img.url} alt="" className="aspect-[4/3] w-full object-cover" />
                  <button
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80"
                    onClick={() => removeGalleryImage(i)}
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="p-2">
                    <Input
                      placeholder="Descrição da imagem..."
                      value={img.caption}
                      onChange={e => updateCaption(i, e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGalleryProjectId(null)}>Cancelar</Button>
            <Button onClick={saveGallery}>Salvar Galeria</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PortfolioPage;
