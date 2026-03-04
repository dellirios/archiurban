import { useApp } from '@/contexts/AppContext';

const Team = () => {
  const { tenantTeam } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Equipe</h1>
        <p className="text-sm text-muted-foreground mt-1">{tenantTeam.length} membros</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tenantTeam.map(member => (
          <div key={member.id} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                {member.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
