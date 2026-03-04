import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Plus, User, Mail, Phone, Briefcase, Shield, Pencil, Trash2 } from 'lucide-react';

const roles = [
  'Arquiteto(a) Principal',
  'Arquiteto(a)',
  'Engenheiro(a) Civil',
  'Designer de Interiores',
  'Coordenador(a) de Projetos',
  'Estagiário(a)',
  'Administrativo',
  'Mestre de Obras',
  'Técnico(a)',
];

const accessLevels = [
  { value: 'viewer', label: 'Visualizador', description: 'Apenas visualiza projetos e dados' },
  { value: 'editor', label: 'Editor', description: 'Pode editar projetos e tarefas' },
  { value: 'manager', label: 'Gerente', description: 'Gerencia equipe e projetos' },
  { value: 'admin', label: 'Administrador', description: 'Acesso total ao sistema' },
];

interface TeamMemberData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  access_level: string;
}

interface TeamMemberModalProps {
  tenantId: string;
  onSuccess: () => void;
  editData?: TeamMemberData | null;
  trigger?: React.ReactNode;
}

const TeamMemberModal = ({ tenantId, onSuccess, editData, trigger }: TeamMemberModalProps) => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [accessLevel, setAccessLevel] = useState('viewer');

  const isEdit = !!editData;

  const populateForm = () => {
    if (editData) {
      setName(editData.name);
      setEmail(editData.email);
      setPhone(editData.phone || '');
      setRole(editData.role);
      setAccessLevel(editData.access_level);
    } else {
      setName(''); setEmail(''); setPhone(''); setRole(''); setAccessLevel('viewer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !role) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }
    setSubmitting(true);

    const payload = {
      tenant_id: tenantId,
      name,
      email,
      phone: phone || null,
      role,
      access_level: accessLevel as any,
    };

    let error;
    if (isEdit && editData?.id) {
      ({ error } = await supabase.from('team_members').update(payload).eq('id', editData.id));
    } else {
      ({ error } = await supabase.from('team_members').insert({ ...payload, avatar_url: null }));
    }

    if (error) {
      toast.error(`Erro: ${error.message}`);
    } else {
      toast.success(isEdit ? `${name} atualizado(a)!` : `${name} adicionado(a) à equipe!`);
      setOpen(false);
      onSuccess();
    }
    setSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) populateForm(); }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Membro
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar Membro' : 'Adicionar Membro à Equipe'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="member-name">Nome completo *</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="member-name" placeholder="Nome do membro" className="pl-9" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="member-email">E-mail *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="member-email" type="email" placeholder="email@exemplo.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="member-phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="member-phone" type="tel" placeholder="(00) 00000-0000" className="pl-9" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Função *</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="Selecione a função" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {roles.map(r => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Nível de Acesso *</Label>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {accessLevels.map(al => (
                  <SelectItem key={al.value} value={al.value}>
                    <div>
                      <span className="font-medium">{al.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">— {al.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Adicionar Membro'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface DeleteTeamMemberButtonProps {
  memberId: string;
  memberName: string;
  onSuccess: () => void;
}

export const DeleteTeamMemberButton = ({ memberId, memberName, onSuccess }: DeleteTeamMemberButtonProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from('team_members').delete().eq('id', memberId);
    if (error) {
      toast.error('Erro ao excluir: ' + error.message);
    } else {
      toast.success(`${memberName} removido(a) da equipe`);
      onSuccess();
    }
    setDeleting(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover membro</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover <strong>{memberName}</strong> da equipe? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            {deleting ? 'Removendo...' : 'Remover'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TeamMemberModal;
