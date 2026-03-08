import { useState } from 'react';
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
  subscribers: number;
}[] = [
  {
    name: 'Basic',
    tier: 'basic',
    price: 97,
    period: '/mês',
    description: 'Para escritórios em fase inicial',
    features: ['Até 3 utilizadores', '5 projetos ativos', 'Chat com clientes', 'Portfólio público básico'],
    color: 'border-border',
    icon: Building2,
    subscribers: 34,
  },
  {
    name: 'Pro',
    tier: 'pro',
    price: 197,
    period: '/mês',
    description: 'Para escritórios em crescimento',
    features: ['Até 10 utilizadores', 'Projetos ilimitados', 'CRM completo', 'Relatórios avançados', 'Portfólio premium'],
    popular: true,
    color: 'border-indigo-500',
    icon: Zap,
    subscribers: 62,
  },
  {
    name: 'Premium',
    tier: 'premium',
    price: 397,
    period: '/mês',
    description: 'Para escritórios consolidados',
    features: ['Utilizadores ilimitados', 'Tudo do Pro', 'API de integração', 'Suporte prioritário', 'White-label', 'Consultoria mensal'],
    color: 'border-amber-500',
    icon: Star,
    subscribers: 28,
  },
];

const mockSubscriptions = [
  { id: 'SUB-001', tenant: 'Studio X Arquitetura', plan: 'Premium', status: 'Ativa', startDate: '2025-03-15', nextBilling: '2026-04-15', amount: 397 },
  { id: 'SUB-002', tenant: 'UrbanLab Design', plan: 'Pro', status: 'Ativa', startDate: '2025-05-22', nextBilling: '2026-04-22', amount: 197 },
  { id: 'SUB-003', tenant: 'Arcos & Concreto', plan: 'Basic', status: 'Ativa', startDate: '2025-07-10', nextBilling: '2026-04-10', amount: 97 },
  { id: 'SUB-004', tenant: 'Forma Livre Projetos', plan: 'Pro', status: 'Trial', startDate: '2026-01-08', nextBilling: '2026-04-08', amount: 0 },
  { id: 'SUB-005', tenant: 'Vertice Arquitetos', plan: 'Premium', status: 'Ativa', startDate: '2025-01-20', nextBilling: '2026-04-20', amount: 397 },
  { id: 'SUB-006', tenant: 'Nuvem Estruturas', plan: 'Basic', status: 'Cancelada', startDate: '2025-09-03', nextBilling: '-', amount: 0 },
];

const mockPayments = [
  { id: 'PAY-0041', tenant: 'Studio X Arquitetura', date: '2026-03-15', amount: 397, status: 'Pago', method: 'Cartão' },
  { id: 'PAY-0040', tenant: 'Vertice Arquitetos', date: '2026-03-20', amount: 397, status: 'Pago', method: 'Cartão' },
  { id: 'PAY-0039', tenant: 'UrbanLab Design', date: '2026-03-22', amount: 197, status: 'Pago', method: 'Boleto' },
  { id: 'PAY-0038', tenant: 'Planta & Papel', date: '2026-03-17', amount: 397, status: 'Pago', method: 'PIX' },
  { id: 'PAY-0037', tenant: 'Raiz Arquitetura', date: '2026-03-14', amount: 197, status: 'Pendente', method: 'Boleto' },
  { id: 'PAY-0036', tenant: 'Arcos & Concreto', date: '2026-03-10', amount: 97, status: 'Pago', method: 'Cartão' },
  { id: 'PAY-0035', tenant: 'Horizonte Urbano', date: '2026-03-01', amount: 97, status: 'Falhou', method: 'Cartão' },
];

const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

const subStatusBadge = (s: string) => {
  const map: Record<string, string> = {
    Ativa: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Trial: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    Cancelada: 'bg-destructive/10 text-destructive border-destructive/20',
  };
  return <Badge variant="outline" className={`text-[11px] ${map[s] || ''}`}>{s}</Badge>;
};

const payStatusBadge = (s: string) => {
  const map: Record<string, string> = {
    Pago: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    Pendente: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    Falhou: 'bg-destructive/10 text-destructive border-destructive/20',
  };
  return <Badge variant="outline" className={`text-[11px] ${map[s] || ''}`}>{s}</Badge>;
};

const AdminBilling = () => {
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const { subscription, refreshSubscription, openCustomerPortal } = useAuth();
  const totalMrr = mockSubscriptions.reduce((s, sub) => s + sub.amount, 0);

  const handleCheckout = async (tier: TierKey) => {
    const priceId = stripeTiers[tier].price_id;
    if (priceId.includes('PLACEHOLDER')) {
      toast.error('Este plano ainda não está configurado no Stripe. Crie o produto no Dashboard do Stripe e atualize o ID em stripeTiers.ts');
      return;
    }

    setLoadingTier(tier);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar sessão de checkout');
    } finally {
      setLoadingTier(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      await openCustomerPortal();
    } catch {
      toast.error('Erro ao abrir portal de gestão');
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" /> Planos & Faturação
        </h1>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-sm text-muted-foreground">
            MRR atual: <span className="font-semibold text-foreground">{fmt(totalMrr)}</span>
            {subscription.subscribed && subscription.tier && (
              <span className="ml-3">
                · Plano atual: <Badge variant="outline" className="ml-1 text-[11px] bg-primary/10 text-primary border-primary/20">{subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}</Badge>
              </span>
            )}
          </p>
          {subscription.subscribed && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1.5"
              disabled={loadingPortal}
              onClick={handleManageSubscription}
            >
              {loadingPortal ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> A abrir...</>
              ) : (
                <><Settings className="w-3.5 h-3.5" /> Gerir Subscrição</>
              )}
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

        {/* Plans */}
        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map(plan => (
              <div
                key={plan.name}
                className={`bg-card border-2 ${plan.color} rounded-xl p-6 space-y-5 relative ${plan.popular ? 'ring-1 ring-indigo-500/30' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[10px]">
                    Mais Popular
                  </Badge>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                    <plan.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground">{plan.subscribers} escritórios</p>
                  </div>
                </div>
                <div>
                  <span className="text-3xl font-bold text-foreground">{fmt(plan.price)}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <ul className="space-y-2">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                {subscription.tier === plan.tier ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs gap-1.5 border-primary text-primary"
                    onClick={handleManageSubscription}
                    disabled={loadingPortal}
                  >
                    {loadingPortal ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> A abrir...</>
                    ) : (
                      <><Settings className="w-3.5 h-3.5" /> Gerir Subscrição</>
                    )}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs gap-1.5"
                    disabled={loadingTier === plan.tier}
                    onClick={() => handleCheckout(plan.tier)}
                  >
                    {loadingTier === plan.tier ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> A processar...</>
                    ) : (
                      <><ExternalLink className="w-3.5 h-3.5" /> Subscrever via Stripe</>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Subscriptions */}
        <TabsContent value="subscriptions">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Escritório</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Plano</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Início</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Próx. Cobrança</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockSubscriptions.map(sub => (
                    <tr key={sub.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{sub.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{sub.tenant}</td>
                      <td className="px-4 py-3 text-muted-foreground">{sub.plan}</td>
                      <td className="px-4 py-3">{subStatusBadge(sub.status)}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(sub.startDate).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{sub.nextBilling === '-' ? '-' : new Date(sub.nextBilling).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 text-right font-medium">{sub.amount > 0 ? fmt(sub.amount) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Payments */}
        <TabsContent value="payments">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-sm font-medium text-foreground">Histórico de Pagamentos</p>
              <Button variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => toast.info('Exportar CSV')}>
                <Download className="w-3.5 h-3.5" /> Exportar
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/30">
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Escritório</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Método</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Estado</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockPayments.map(p => (
                    <tr key={p.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{p.id}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{p.tenant}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(p.date).toLocaleDateString('pt-BR')}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.method}</td>
                      <td className="px-4 py-3">{payStatusBadge(p.status)}</td>
                      <td className="px-4 py-3 text-right font-medium">{fmt(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminBilling;
