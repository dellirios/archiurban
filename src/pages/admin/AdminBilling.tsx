import { useState, useEffect } from 'react';
import {
  CreditCard, Check, Star, Zap, Building2,
  Receipt, Calendar, Download, Loader2, ExternalLink, Settings,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { stripeTiers, type TierKey } from '@/data/stripeTiers';

interface StripeSub {
  id: string;
  tenant: string;
  plan: string;
  status: string;
  startDate: string;
  nextBilling: string | null;
  amount: number;
  currency: string;
}

interface StripePayment {
  id: string;
  tenant: string;
  date: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
}

const plans: {
  name: string;
  tier: TierKey;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
  icon: typeof Building2;
}[] = [
  {
    name: 'Basic', tier: 'basic', price: 97, period: '/mês',
    description: 'Para escritórios em fase inicial',
    features: ['Até 3 utilizadores', '5 projetos ativos', 'Chat com clientes', 'Portfólio público básico'],
    color: 'border-border', icon: Building2,
  },
  {
    name: 'Pro', tier: 'pro', price: 197, period: '/mês',
    description: 'Para escritórios em crescimento',
    features: ['Até 10 utilizadores', 'Projetos ilimitados', 'CRM completo', 'Relatórios avançados', 'Portfólio premium'],
    popular: true, color: 'border-primary', icon: Zap,
  },
  {
    name: 'Premium', tier: 'premium', price: 397, period: '/mês',
    description: 'Para escritórios consolidados',
    features: ['Utilizadores ilimitados', 'Tudo do Pro', 'API de integração', 'Suporte prioritário', 'White-label', 'Consultoria mensal'],
    color: 'border-amber-500', icon: Star,
  },
];

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const statusMap: Record<string, { label: string; className: string }> = {
  active: { label: 'Ativa', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  trialing: { label: 'Trial', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  canceled: { label: 'Cancelada', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  past_due: { label: 'Vencida', className: 'bg-destructive/10 text-destructive border-destructive/20' },
  succeeded: { label: 'Pago', className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
  pending: { label: 'Pendente', className: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
  failed: { label: 'Falhou', className: 'bg-destructive/10 text-destructive border-destructive/20' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const info = statusMap[status] || { label: status, className: '' };
  return <Badge variant="outline" className={`text-[11px] ${info.className}`}>{info.label}</Badge>;
};

const AdminBilling = () => {
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [subs, setSubs] = useState<StripeSub[]>([]);
  const [payments, setPayments] = useState<StripePayment[]>([]);
  const [mrr, setMrr] = useState(0);
  const { subscription, openCustomerPortal } = useAuth();

  useEffect(() => {
    const fetchBilling = async () => {
      setLoadingData(true);
      try {
        const { data, error } = await supabase.functions.invoke('admin-billing');
        if (error) throw error;
        setSubs(data?.subscriptions || []);
        setPayments(data?.payments || []);
        setMrr(data?.mrr || 0);
      } catch (err: any) {
        console.error('Error fetching billing data:', err);
        toast.error('Erro ao carregar dados de faturação');
      } finally {
        setLoadingData(false);
      }
    };
    fetchBilling();
  }, []);

  const handleCheckout = async (tier: TierKey) => {
    const priceId = stripeTiers[tier].price_id;
    if (priceId.includes('PLACEHOLDER')) {
      toast.error('Este plano ainda não está configurado no Stripe.');
      return;
    }
    setLoadingTier(tier);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', { body: { priceId } });
      if (error) throw error;
      if (data?.url) window.open(data.url, '_blank');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar sessão de checkout');
    } finally {
      setLoadingTier(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try { await openCustomerPortal(); } catch { toast.error('Erro ao abrir portal'); }
    finally { setLoadingPortal(false); }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" /> Planos & Faturação
        </h1>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-sm text-muted-foreground">
            MRR atual: <span className="font-semibold text-foreground">{fmt(mrr)}</span>
            {subscription.subscribed && subscription.tier && (
              <span className="ml-3">
                · Plano atual: <Badge variant="outline" className="ml-1 text-[11px] bg-primary/10 text-primary border-primary/20">
                  {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
                </Badge>
              </span>
            )}
          </p>
          {subscription.subscribed && (
            <Button variant="outline" size="sm" className="text-xs gap-1.5" disabled={loadingPortal} onClick={handleManageSubscription}>
              {loadingPortal ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> A abrir...</> : <><Settings className="w-3.5 h-3.5" /> Gerir Subscrição</>}
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="plans" className="space-y-4">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="plans" className="text-xs gap-1.5"><Star className="w-3.5 h-3.5" /> Planos</TabsTrigger>
          <TabsTrigger value="subscriptions" className="text-xs gap-1.5"><Calendar className="w-3.5 h-3.5" /> Subscrições</TabsTrigger>
          <TabsTrigger value="payments" className="text-xs gap-1.5"><Receipt className="w-3.5 h-3.5" /> Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map(plan => (
              <div key={plan.name} className={`bg-card border-2 ${plan.color} rounded-xl p-6 space-y-5 relative ${plan.popular ? 'ring-1 ring-primary/30' : ''}`}>
                {plan.popular && <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px]">Mais Popular</Badge>}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center"><plan.icon className="w-5 h-5 text-primary" /></div>
                  <div>
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                  </div>
                </div>
                <div><span className="text-3xl font-bold text-foreground">{fmt(plan.price)}</span><span className="text-sm text-muted-foreground">{plan.period}</span></div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.features.map(f => <li key={f} className="flex items-center gap-2 text-sm text-foreground"><Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {f}</li>)}
                </ul>
                {subscription.tier === plan.tier ? (
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 border-primary text-primary" onClick={handleManageSubscription} disabled={loadingPortal}>
                    {loadingPortal ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> A abrir...</> : <><Settings className="w-3.5 h-3.5" /> Gerir Subscrição</>}
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5" disabled={loadingTier === plan.tier} onClick={() => handleCheckout(plan.tier)}>
                    {loadingTier === plan.tier ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> A processar...</> : <><ExternalLink className="w-3.5 h-3.5" /> Subscrever via Stripe</>}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subscriptions">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {loadingData ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : subs.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Nenhuma subscrição encontrada no Stripe.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Plano</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Início</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Próx. Cobrança</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {subs.map(sub => (
                      <tr key={sub.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{sub.id.substring(0, 14)}…</td>
                        <td className="px-4 py-3 font-medium text-foreground">{sub.tenant}</td>
                        <td className="px-4 py-3 text-muted-foreground">{sub.plan}</td>
                        <td className="px-4 py-3"><StatusBadge status={sub.status} /></td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(sub.startDate).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{sub.nextBilling ? new Date(sub.nextBilling).toLocaleDateString('pt-BR') : '-'}</td>
                        <td className="px-4 py-3 text-right font-medium">{sub.amount > 0 ? fmt(sub.amount) : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="payments">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-sm font-medium text-foreground">Histórico de Pagamentos</p>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.info('Exportar CSV')}><Download className="w-3.5 h-3.5" /> Exportar</Button>
            </div>
            {loadingData ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : payments.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">Nenhum pagamento encontrado no Stripe.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Método</th>
                      <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{p.id.substring(0, 14)}…</td>
                        <td className="px-4 py-3 font-medium text-foreground">{p.tenant}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">{p.method}</td>
                        <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                        <td className="px-4 py-3 text-right font-medium">{fmt(p.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBilling;
