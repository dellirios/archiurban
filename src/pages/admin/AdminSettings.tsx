import { useState, useEffect } from 'react';
import {
  Settings, Globe, Shield, Bell, Palette, Database, Save, Loader2,
  Mail, Key, ToggleLeft, CheckCircle2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface PlatformSettings {
  id?: string;
  platformName: string;
  supportEmail: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  allowSignups: boolean;
  requireEmailVerification: boolean;
  maxTenantsPerPlan: string;
  defaultTrialDays: string;
  smtpHost: string;
  smtpPort: string;
  notifyNewTenant: boolean;
  notifyNewPayment: boolean;
  notifyChurn: boolean;
  stripeWebhookSecret: string;
  apiRateLimit: string;
  customCSS: string;
}

const defaults: PlatformSettings = {
  platformName: 'ArchiUrban',
  supportEmail: '',
  defaultLanguage: 'pt-BR',
  maintenanceMode: false,
  allowSignups: true,
  requireEmailVerification: true,
  maxTenantsPerPlan: '100',
  defaultTrialDays: '14',
  smtpHost: '',
  smtpPort: '587',
  notifyNewTenant: true,
  notifyNewPayment: true,
  notifyChurn: true,
  stripeWebhookSecret: '',
  apiRateLimit: '100',
  customCSS: '',
};

const AdminSettings = () => {
  const [saving, setSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [settings, setSettings] = useState<PlatformSettings>(defaults);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('platform_settings').select('*').limit(1).single();
      if (data) {
        setSettings({
          id: data.id,
          platformName: data.platform_name || defaults.platformName,
          supportEmail: data.support_email || '',
          defaultLanguage: data.default_language || 'pt-BR',
          maintenanceMode: data.maintenance_mode ?? false,
          allowSignups: data.allow_signups ?? true,
          requireEmailVerification: data.require_email_verification ?? true,
          maxTenantsPerPlan: String(data.max_tenants_per_plan || 100),
          defaultTrialDays: String(data.default_trial_days || 14),
          smtpHost: data.smtp_host || '',
          smtpPort: data.smtp_port || '587',
          notifyNewTenant: data.notify_new_tenant ?? true,
          notifyNewPayment: data.notify_new_payment ?? true,
          notifyChurn: data.notify_churn ?? true,
          stripeWebhookSecret: data.stripe_webhook_secret || '',
          apiRateLimit: String(data.api_rate_limit || 100),
          customCSS: data.custom_css || '',
        });
      }
      setLoadingData(false);
    };
    load();
  }, []);

  const update = (key: keyof PlatformSettings, value: string | boolean) =>
    setSettings(prev => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      platform_name: settings.platformName,
      support_email: settings.supportEmail,
      default_language: settings.defaultLanguage,
      maintenance_mode: settings.maintenanceMode,
      allow_signups: settings.allowSignups,
      require_email_verification: settings.requireEmailVerification,
      max_tenants_per_plan: Number(settings.maxTenantsPerPlan) || 100,
      default_trial_days: Number(settings.defaultTrialDays) || 14,
      smtp_host: settings.smtpHost,
      smtp_port: settings.smtpPort,
      notify_new_tenant: settings.notifyNewTenant,
      notify_new_payment: settings.notifyNewPayment,
      notify_churn: settings.notifyChurn,
      stripe_webhook_secret: settings.stripeWebhookSecret,
      api_rate_limit: Number(settings.apiRateLimit) || 100,
      custom_css: settings.customCSS,
      updated_at: new Date().toISOString(),
    };

    const { error } = settings.id
      ? await supabase.from('platform_settings').update(payload as any).eq('id', settings.id)
      : await supabase.from('platform_settings').insert(payload as any);

    setSaving(false);
    if (error) { toast.error('Erro ao salvar: ' + error.message); return; }
    toast.success('Configurações salvas com sucesso!');
  };

  if (loadingData) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" /> Configurações da Plataforma
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gerencie as configurações globais do ArchiUrban</p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={handleSave} disabled={saving}>
          {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Salvando...</> : <><Save className="w-3.5 h-3.5" /> Salvar Alterações</>}
        </Button>
      </div>

      {/* General */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Geral</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Nome da Plataforma</Label>
            <Input value={settings.platformName} onChange={e => update('platformName', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Email de Suporte</Label>
            <Input value={settings.supportEmail} onChange={e => update('supportEmail', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Idioma Padrão</Label>
            <Input value={settings.defaultLanguage} onChange={e => update('defaultLanguage', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Dias de Trial Padrão</Label>
            <Input type="number" value={settings.defaultTrialDays} onChange={e => update('defaultTrialDays', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Access & Security */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Acesso & Segurança</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Modo de Manutenção</p>
              <p className="text-xs text-muted-foreground">Bloqueia acesso de utilizadores não-admin</p>
            </div>
            <Switch checked={settings.maintenanceMode} onCheckedChange={v => update('maintenanceMode', v)} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Permitir Novos Registos</p>
              <p className="text-xs text-muted-foreground">Novos escritórios podem se registar na plataforma</p>
            </div>
            <Switch checked={settings.allowSignups} onCheckedChange={v => update('allowSignups', v)} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Exigir Verificação de Email</p>
              <p className="text-xs text-muted-foreground">Utilizadores devem confirmar email antes de aceder</p>
            </div>
            <Switch checked={settings.requireEmailVerification} onCheckedChange={v => update('requireEmailVerification', v)} />
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Limite de Rate (req/min)</Label>
              <Input type="number" value={settings.apiRateLimit} onChange={e => update('apiRateLimit', e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Máx. Escritórios por Plano</Label>
              <Input type="number" value={settings.maxTenantsPerPlan} onChange={e => update('maxTenantsPerPlan', e.target.value)} />
            </div>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Notificações Admin</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Novo Escritório Registado</p>
              <p className="text-xs text-muted-foreground">Receber email quando um novo tenant é criado</p>
            </div>
            <Switch checked={settings.notifyNewTenant} onCheckedChange={v => update('notifyNewTenant', v)} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Novo Pagamento</p>
              <p className="text-xs text-muted-foreground">Receber notificação quando um pagamento é processado</p>
            </div>
            <Switch checked={settings.notifyNewPayment} onCheckedChange={v => update('notifyNewPayment', v)} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Churn / Cancelamento</p>
              <p className="text-xs text-muted-foreground">Alerta quando um escritório cancela a subscrição</p>
            </div>
            <Switch checked={settings.notifyChurn} onCheckedChange={v => update('notifyChurn', v)} />
          </div>
        </div>
      </section>

      {/* Email / SMTP */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Configuração de Email (SMTP)</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Host SMTP</Label>
            <Input placeholder="smtp.exemplo.com" value={settings.smtpHost} onChange={e => update('smtpHost', e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Porta SMTP</Label>
            <Input type="number" value={settings.smtpPort} onChange={e => update('smtpPort', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Integrações</h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Stripe Webhook Secret</Label>
            <Input type="password" placeholder="whsec_..." value={settings.stripeWebhookSecret} onChange={e => update('stripeWebhookSecret', e.target.value)} />
            <p className="text-[10px] text-muted-foreground">Usado para validar webhooks do Stripe</p>
          </div>
        </div>
      </section>

      {/* Custom CSS */}
      <section className="bg-card border border-border rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Personalização</h2>
        </div>
        <div className="space-y-1.5">
          <Label>CSS Personalizado (global)</Label>
          <Textarea rows={4} placeholder="/* CSS personalizado */" value={settings.customCSS} onChange={e => update('customCSS', e.target.value)} className="font-mono text-xs" />
          <p className="text-[10px] text-muted-foreground">Aplicado globalmente a toda a plataforma</p>
        </div>
      </section>

      {/* Bottom save */}
      <div className="flex justify-end pb-6">
        <Button className="gap-1.5" onClick={handleSave} disabled={saving}>
          {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : <><CheckCircle2 className="w-4 h-4" /> Salvar Todas as Configurações</>}
        </Button>
      </div>
    </div>
  );
};

export default AdminSettings;
