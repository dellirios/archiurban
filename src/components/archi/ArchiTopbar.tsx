import { useState } from 'react';
import { Search, ChevronDown, ArrowLeftRight, LogOut, Sun, Moon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import NotificationBell from './NotificationBell';

const ArchiTopbar = () => {
  const { currentTenant, viewMode, setViewMode, theme, toggleTheme } = useApp();
  const { profile, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userName = profile?.full_name || 'Usuário';
  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 gap-4">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar projetos, clientes..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-secondary border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors" title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}>
          {theme === 'light' ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
        </button>

        <button onClick={() => setViewMode(viewMode === 'architect' ? 'client' : 'architect')} className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-all">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{viewMode === 'architect' ? 'Portal Cliente' : 'Painel Arquiteto'}</span>
        </button>

        {/* Tenant badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground">
          <span className="w-5 h-5 rounded bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
            {currentTenant.logo || currentTenant.name.slice(0, 2).toUpperCase()}
          </span>
          <span className="hidden md:inline truncate max-w-[100px]">{currentTenant.name}</span>
        </div>

        {/* Notifications */}
        <NotificationBell />

        {/* User Menu */}
        <div className="relative">
          <button onClick={() => { setShowUserMenu(s => !s); }} className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-lg hover:bg-accent transition-colors">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">{userInitials}</div>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <p className="text-xs text-muted-foreground">{profile?.role || 'architect'}</p>
              </div>
              <button onClick={signOut} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors">
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ArchiTopbar;
