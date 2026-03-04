import { useState } from 'react';
import { Search, Bell, ChevronDown, ArrowLeftRight, LogOut, Sun, Moon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { tenants } from '@/data/mockData';
import { cn } from '@/lib/utils';

const ArchiTopbar = () => {
  const { currentUser, currentTenant, viewMode, setViewMode, setCurrentTenant, notifications, theme, toggleTheme } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTenantSelector, setShowTenantSelector] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const closeAll = () => { setShowNotifications(false); setShowTenantSelector(false); setShowUserMenu(false); };
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 gap-4">
      {/* Search */}
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
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          title={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
        >
          {theme === 'light' ? <Moon className="w-[18px] h-[18px]" /> : <Sun className="w-[18px] h-[18px]" />}
        </button>

        {/* View Toggle */}
        <button
          onClick={() => setViewMode(viewMode === 'architect' ? 'client' : 'architect')}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-all"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {viewMode === 'architect' ? 'Portal Cliente' : 'Painel Arquiteto'}
          </span>
        </button>

        {/* Tenant Selector */}
        <div className="relative">
          <button
            onClick={() => { closeAll(); setShowTenantSelector(s => !s); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
          >
            <span className="w-5 h-5 rounded bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">
              {currentTenant.logo}
            </span>
            <span className="hidden md:inline truncate max-w-[100px]">{currentTenant.name}</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {showTenantSelector && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
              <p className="px-3 py-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Selecionar Escritório</p>
              {tenants.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setCurrentTenant(t.id); setShowTenantSelector(false); }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-accent transition-colors',
                    t.id === currentTenant.id && 'bg-accent'
                  )}
                >
                  <span className="w-7 h-7 rounded bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                    {t.logo}
                  </span>
                  <span className="text-foreground">{t.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { closeAll(); setShowNotifications(s => !s); }}
            className="relative p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
              <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Notificações</p>
              {notifications.slice(0, 4).map(n => (
                <div
                  key={n.id}
                  className={cn(
                    'px-4 py-3 hover:bg-accent transition-colors border-b border-border last:border-0',
                    !n.read && 'bg-primary/5'
                  )}
                >
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => { closeAll(); setShowUserMenu(s => !s); }}
            className="flex items-center gap-2 pl-3 pr-1 py-1 rounded-lg hover:bg-accent transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
              {currentUser.avatar}
            </div>
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors">
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ArchiTopbar;
