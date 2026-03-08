import { Lock, Zap, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  feature: string;
  requiredTier: string;
  description?: string;
}

const UpgradeModal = ({ open, onClose, feature, requiredTier, description }: UpgradeModalProps) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header gradient */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-6 pt-8 pb-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Funcionalidade Bloqueada</h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            <span className="font-medium text-foreground">{feature}</span> requer o plano{' '}
            <span className="font-semibold text-primary capitalize">{requiredTier}</span> ou superior.
          </p>
        </div>

        <div className="px-6 pb-6 space-y-4">
          {description && (
            <p className="text-sm text-muted-foreground text-center">{description}</p>
          )}

          <div className="bg-secondary/50 rounded-lg p-4 space-y-2.5">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
              O que inclui o plano {requiredTier}:
            </p>
            {requiredTier === 'pro' && (
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-primary shrink-0" /> CRM completo com funil Kanban</li>
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-primary shrink-0" /> Relatórios e análises avançadas</li>
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-primary shrink-0" /> Projetos ilimitados</li>
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-primary shrink-0" /> Até 10 utilizadores</li>
              </ul>
            )}
            {requiredTier === 'premium' && (
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-primary shrink-0" /> Tudo do plano Pro</li>
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-primary shrink-0" /> API de integração</li>
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-primary shrink-0" /> White-label</li>
                <li className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-primary shrink-0" /> Suporte prioritário</li>
              </ul>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 text-sm" onClick={onClose}>
              Voltar
            </Button>
            <Button
              className="flex-1 text-sm gap-1.5"
              onClick={() => {
                onClose();
                navigate('/admin/billing');
              }}
            >
              Ver Planos <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
