import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShieldX } from 'lucide-react';

interface Props {
  children: ReactNode;
}

const SuperAdminRoute = ({ children }: Props) => {
  const { user, loading: authLoading } = useAuth();
  const [checking, setChecking] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!user) { setChecking(false); return; }
      const { data } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'super_admin',
      });
      setIsSuperAdmin(!!data);
      setChecking(false);
    };
    if (!authLoading) check();
  }, [user, authLoading]);

  if (authLoading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin" replace />;

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <ShieldX className="w-12 h-12 text-destructive" />
        <h1 className="text-xl font-semibold text-foreground">Acesso Restrito</h1>
        <p className="text-sm text-muted-foreground">Apenas super administradores podem aceder a esta área.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default SuperAdminRoute;
