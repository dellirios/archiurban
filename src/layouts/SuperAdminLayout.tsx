import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Building2, CreditCard, Settings, Shield,
  Menu, X, ChevronLeft, LogOut, UserCog, Users,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { label: 'Visão Geral', to: '/admin/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Escritórios', to: '/admin/tenants', icon: Building2 },
  { label: 'Equipe ArchiUrban', to: '/admin/team', icon: Users },
  { label: 'Planos & Faturação', to: '/admin/billing', icon: CreditCard },
  { label: 'Configurações', to: '/admin/settings', icon: Settings },
];

const SuperAdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'SA';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Sessão encerrada.');
    navigate('/admin');
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* ── SIDEBAR ── */}
      <aside
        className={cn(
          'flex flex-col border-r border-slate-800 bg-slate-900 text-slate-300 transition-all duration-200 shrink-0',
          collapsed ? 'w-16' : 'w-60',
        )}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-slate-800 shrink-0">
          <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
          {!collapsed && (
            <span className="text-sm font-semibold text-white tracking-tight truncate">
              ArchiUrban Admin
            </span>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="ml-auto text-slate-500 hover:text-white transition-colors"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 space-y-0.5 px-2 overflow-y-auto">
          {navItems.map(item => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-300 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800',
                )}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-800 shrink-0">
          {!collapsed && (
            <p className="text-[10px] text-slate-600 text-center">Super Admin v1.0</p>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-6 border-b border-border bg-card">
          <h2 className="text-sm font-medium text-foreground">Painel Administrativo</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {initials}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/admin/settings')} className="gap-2 text-xs">
                <UserCog className="w-3.5 h-3.5" /> Editar Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="gap-2 text-xs text-destructive focus:text-destructive">
                <LogOut className="w-3.5 h-3.5" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
