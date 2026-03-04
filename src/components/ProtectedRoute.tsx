import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Building2 } from 'lucide-react';
import TenantSetup from '@/pages/TenantSetup';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Building2 className="h-12 w-12 text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Show tenant setup if user has no tenant_id
  if (profile && !profile.tenant_id) {
    return <TenantSetup />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
