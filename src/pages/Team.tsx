import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import TeamMemberModal, { DeleteTeamMemberButton } from '@/components/archi/TeamMemberModal';
import { Badge } from '@/components/ui/badge';
import { Shield, Mail, Phone, Pencil } from 'lucide-react';

const accessLevelLabels: Record<string, string> = {
  viewer: 'Visualizador',
  editor: 'Editor',
  manager: 'Gerente',
  admin: 'Administrador',
};

const accessLevelColors: Record<string, string> = {
  viewer: 'bg-secondary text-secondary-foreground',
  editor: 'bg-accent text-accent-foreground',
  manager: 'bg-primary/10 text-primary',
  admin: 'bg-primary text-primary-foreground',
};

interface TeamMemberRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  access_level: string;
  avatar_url: string | null;
  active: boolean;
  tenant_id: string;
}

const Team = () => {
  const { tenantTeam } = useApp();
  const { profile } = useAuth();
  const [dbMembers, setDbMembers] = useState<TeamMemberRow[]>([]);
  const [loading, setLoading] = useState(true);

  const tenantId = profile?.tenant_id || 'tenant-1';

  const fetchMembers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false });
    setDbMembers((data as TeamMemberRow[] | null) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, [tenantId]);

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const allMembers = [
    ...dbMembers.map(m => ({
      id: m.id,
      name: m.name,
      role: m.role,
      avatar: m.avatar_url || getInitials(m.name),
      email: m.email,
      phone: m.phone || '',
      accessLevel: m.access_level,
      isDb: true,
    })),
    ...tenantTeam.map(m => ({
      id: m.id,
      name: m.name,
      role: m.role,
      avatar: m.avatar,
      email: '',
      phone: '',
      accessLevel: 'editor' as string,
      isDb: false,
    })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Equipe</h1>
          <p className="text-sm text-muted-foreground mt-1">{allMembers.length} membros</p>
        </div>
        <TeamMemberModal tenantId={tenantId} onSuccess={fetchMembers} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allMembers.map(member => (
          <div key={member.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow group relative">
            {/* Edit/Delete buttons for DB members */}
            {member.isDb && (
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <TeamMemberModal
                  tenantId={tenantId}
                  onSuccess={fetchMembers}
                  editData={{
                    id: member.id,
                    name: member.name,
                    email: member.email,
                    phone: member.phone,
                    role: member.role,
                    access_level: member.accessLevel,
                  }}
                  trigger={
                    <button className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  }
                />
                <DeleteTeamMemberButton
                  memberId={member.id}
                  memberName={member.name}
                  onSuccess={fetchMembers}
                />
              </div>
            )}

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center flex-shrink-0">
                {member.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
                {member.email && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <Mail className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Phone className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{member.phone}</span>
                  </div>
                )}
                <div className="mt-2">
                  <Badge variant="secondary" className={accessLevelColors[member.accessLevel] || ''}>
                    <Shield className="w-3 h-3 mr-1" />
                    {accessLevelLabels[member.accessLevel] || member.accessLevel}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center py-8 text-muted-foreground">Carregando...</div>
      )}
    </div>
  );
};

export default Team;
