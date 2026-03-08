import { useState } from 'react';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import UpgradeModal from '@/components/archi/UpgradeModal';
import CrmBoard from '@/components/archi/CrmBoard';
import { Lock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CrmPage = () => {
  const { limits, currentTier, isLoading } = useSubscriptionLimits();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const navigate = useNavigate();

  if (!limits.crmEnabled && !isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão de leads e pipeline comercial</p>
        </div>

        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-xl">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">CRM disponível no plano Pro</h2>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
            Gerencie seus leads com funil Kanban, métricas de conversão e histórico de interações.
            Faça upgrade para o plano <span className="font-semibold text-primary">Pro</span> para desbloquear.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={() => navigate('/app/dashboard')}>
              Voltar ao Dashboard
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => setShowUpgrade(true)}>
              <TrendingUp className="w-4 h-4" /> Ver Planos
            </Button>
          </div>
        </div>

        <UpgradeModal
          open={showUpgrade}
          onClose={() => setShowUpgrade(false)}
          feature="CRM"
          requiredTier="pro"
          description="Gerencie seus leads, acompanhe o pipeline comercial e aumente suas conversões."
        />
      </div>
    );
  }

  return <CrmBoard />;
};

export default CrmPage;
