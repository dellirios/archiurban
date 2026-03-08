import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, DollarSign, Users, UserCircle, Settings,
  ChevronLeft, ChevronRight, Building2, LogOut, MessageSquare, TrendingUp,
  ShoppingCart, LayoutTemplate, BarChart3, Briefcase, Lock,
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionLimits } from '@/hooks/useSubscriptionLimits';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Visão Geral', path: '/app' },
  { icon: FolderKanban, label: 'Projetos', path: '/app/projects' },
  { icon: TrendingUp, label: 'CRM', path: '/app/crm', gateKey: 'crmEnabled' as const },
  { icon: ShoppingCart, label: 'Compras', path: '/app/purchases' },
  { icon: MessageSquare, label: 'Chat', path: '/app/chat' },
  { icon: DollarSign, label: 'Financeiro', path: '#', disabled: true, badge: 'Em breve' },
  { icon: BarChart3, label: 'Relatórios', path: '/app/reports', gateKey: 'advancedReports' as const },
  { icon: Users, label: 'Equipe', path: '/app/team' },
  { icon: UserCircle, label: 'Clientes', path: '/app/clients' },
  { icon: LayoutTemplate, label: 'Templates', path: '/app/templates' },
  { icon: Briefcase, label: 'Portfólio', path: '/app/portfolio' },
  { icon: Settings, label: 'Configurações', path: '/app/settings' },
];

const ArchiSidebar = () => {
  const { sidebarOpen, setSidebarOpen, currentTenant } = useApp();
  const { signOut } = useAuth();
  const { limits } = useSubscriptionLimits();
  const location = useLocation();

  return (
    <aside className={cn('fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 flex flex-col', sidebarOpen ? 'w-64' : 'w-[68px]')}>
      <div className="h-16 flex items-center px-4 border-b border-border gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-primary-foreground" />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <h1 className="text-sm font-semibold text-foreground truncate">ArchiUrban</h1>
            <p className="text-[10px] text-muted-foreground truncate">{currentTenant.name}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.path !== '#' && (item.path === '/app' ? location.pathname === '/app' : location.pathname.startsWith(item.path));
          const isLocked = item.gateKey ? !limits[item.gateKey] : false;
          return (
            <Link
              key={item.label}
              to={item.disabled ? '#' : item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                isActive ? 'bg-primary text-primary-foreground shadow-sm'
                  : item.disabled ? 'text-muted-foreground/50 cursor-not-allowed'
                  : isLocked ? 'text-muted-foreground/60 hover:bg-accent hover:text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
              onClick={(e) => item.disabled && e.preventDefault()}
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{item.badge}</span>}
                  {isLocked && !item.badge && <Lock className="ml-auto w-3.5 h-3.5 text-muted-foreground/50" />}
                </>
              )}
              {!sidebarOpen && isLocked && (
                <Lock className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 text-muted-foreground/50" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <button onClick={signOut} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors', !sidebarOpen && 'justify-center')}>
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {sidebarOpen && <span>Sair</span>}
        </button>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

export default ArchiSidebar;
