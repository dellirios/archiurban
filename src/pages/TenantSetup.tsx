import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { Building2, Plus } from 'lucide-react';
import { tenants } from '@/data/mockData';

const TenantSetup = () => {
  const { profile, updateProfile } = useAuth();
  const [mode, setMode] = useState<'select' | 'create'>('select');
  const [selectedTenant, setSelectedTenant] = useState('');
  const [newTenantName, setNewTenantName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSelectTenant = async () => {
    if (!selectedTenant) {
      toast.error('Selecione um escritório');
      return;
    }
    setSubmitting(true);
    const { error } = await updateProfile({ tenant_id: selectedTenant });
    if (error) {
      toast.error('Erro: ' + error.message);
    } else {
      toast.success('Escritório vinculado com sucesso!');
    }
    setSubmitting(false);
  };

  const handleCreateTenant = async () => {
    if (!newTenantName.trim()) {
      toast.error('Informe o nome do escritório');
      return;
    }
    setSubmitting(true);
    const tenantId = `tenant-${Date.now()}`;
    const { error } = await updateProfile({ tenant_id: tenantId });
    if (error) {
      toast.error('Erro: ' + error.message);
    } else {
      toast.success(`Escritório "${newTenantName}" criado!`);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="flex items-center gap-3 justify-center">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">ArchiUrban</span>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Configurar Escritório</CardTitle>
            <CardDescription>
              {profile?.full_name ? `Olá, ${profile.full_name}! ` : ''}
              Vincule-se a um escritório para começar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mode === 'select' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Selecione um escritório existente</Label>
                  <Select value={selectedTenant} onValueChange={setSelectedTenant}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha o escritório" />
                    </SelectTrigger>
                    <SelectContent>
                      {tenants.map(t => (
                        <SelectItem key={t.id} value={t.id}>
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
                              {t.logo}
                            </span>
                            {t.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleSelectTenant} disabled={submitting}>
                  {submitting ? 'Vinculando...' : 'Entrar no escritório'}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-card px-2 text-muted-foreground">ou</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={() => setMode('create')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar novo escritório
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tenant-name">Nome do escritório</Label>
                  <Input
                    id="tenant-name"
                    placeholder="Ex: Studio Arcos Arquitetura"
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full" onClick={handleCreateTenant} disabled={submitting}>
                  {submitting ? 'Criando...' : 'Criar escritório'}
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setMode('select')}>
                  Voltar para seleção
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TenantSetup;
