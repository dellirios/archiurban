import React, { createContext, useContext, useState, ReactNode } from 'react';
import { tenants, users, projects, clients, teamMembers, notifications, type Tenant, type User, type Project, type Client, type TeamMember, type Notification } from '@/data/mockData';

interface AppState {
  currentUser: User;
  currentTenant: Tenant;
  viewMode: 'architect' | 'client';
  sidebarOpen: boolean;
  tenantProjects: Project[];
  tenantClients: Client[];
  tenantTeam: TeamMember[];
  notifications: Notification[];
  setViewMode: (mode: 'architect' | 'client') => void;
  setCurrentTenant: (tenantId: string) => void;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<'architect' | 'client'>('architect');
  const [currentTenantId, setCurrentTenantId] = useState('tenant-1');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const currentTenant = tenants.find(t => t.id === currentTenantId) || tenants[0];
  const currentUser = viewMode === 'architect'
    ? users.find(u => u.role === 'architect' && u.tenantId === currentTenantId) || users[0]
    : users.find(u => u.role === 'client' && u.tenantId === currentTenantId) || users[2];

  const tenantProjects = projects.filter(p => p.tenantId === currentTenantId);
  const tenantClients = clients.filter(c => c.tenantId === currentTenantId);
  const tenantTeam = teamMembers.filter(t => t.tenantId === currentTenantId);

  const handleSetTenant = (tenantId: string) => {
    setCurrentTenantId(tenantId);
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      currentTenant,
      viewMode,
      sidebarOpen,
      tenantProjects,
      tenantClients,
      tenantTeam,
      notifications,
      setViewMode,
      setCurrentTenant: handleSetTenant,
      setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
