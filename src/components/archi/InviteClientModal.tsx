import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Send, User, Mail } from 'lucide-react';

interface InviteClientModalProps {
  tenantId: string;
  onSuccess?: () => void;
}

const InviteClientModal = ({ tenantId, onSuccess }: InviteClientModalProps) => {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Preencha todos os campos');
      return;
    }
    setSubmitting(true);

    const { data, error } = await supabase.functions.invoke('invite-client', {
      body: { email, clientName: name, tenantId },
    });

    if (error) {
      toast.error('Erro ao enviar convite: ' + error.message);
    } else if (data?.error) {
      toast.error('Erro: ' + data.error);
    } else {
      toast.success(`Convite enviado para ${email}!`);
      setName('');
      setEmail('');
      setOpen(false);
      onSuccess?.();
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Send className="mr-2 h-4 w-4" />
          Convidar Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Convidar Cliente</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          O cliente receberá um e-mail com um link para criar sua conta e acompanhar o andamento das obras.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="client-name">Nome do cliente *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="client-name"
                placeholder="Nome completo"
                className="pl-9"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-email">E-mail *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="client-email"
                type="email"
                placeholder="cliente@email.com"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar Convite'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteClientModal;
