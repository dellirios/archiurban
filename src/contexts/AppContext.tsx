import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { tenants, users, projects as initialProjects, clients, teamMembers, notifications, type Tenant, type User, type Project, type Client, type TeamMember, type Notification } from '@/data/mockData';

type Theme = 'light' | 'dark';

interface AppState {
  currentUser: User;
  currentTenant: Tenant;
  viewMode: 'architect' | 'client';
  sidebarOpen: boolean;
  tenantProjects: Project[];
  tenantClients: Client[];
  tenantTeam: TeamMember[];
  notifications: Notification[];
  allProjects: Project[];
  theme: Theme;
  setViewMode: (mode: 'architect' | 'client') => void;
  setCurrentTenant: (tenantId: string) => void;
  setSidebarOpen: (open: boolean) => void;
  addProject: (project: Project) => void;
  updateProjectStatus: (projectId: string, status: Project['status']) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<'architect' | 'client'>('architect');
  const [currentTenantId, setCurrentTenantId] = useState('tenant-1');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [allProjects, setAllProjects] = useState<Project[]>(initialProjects);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('archi-theme') as Theme) || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('archi-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const currentTenant = tenants.find(t => t.id === currentTenantId) || tenants[0];
  const currentUser = viewMode === 'architect'
    ? users.find(u => u.role === 'architect' && u.tenantId === currentTenantId) || users[0]
    : users.find(u => u.role === 'client' && u.tenantId === currentTenantId) || users[2];

  const tenantProjects = allProjects.filter(p => p.tenantId === currentTenantId);
  const tenantClients = clients.filter(c => c.tenantId === currentTenantId);
  const tenantTeam = teamMembers.filter(t => t.tenantId === currentTenantId);

  const addProject = (project: Project) => {
    setAllProjects(prev => [...prev, project]);
  };

  const updateProjectStatus = (projectId: string, status: Project['status']) => {
    setAllProjects(prev => prev.map(p => p.id === projectId ? { ...p, status } : p));
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
      allProjects,
      theme,
      setViewMode,
      setCurrentTenant: (id: string) => setCurrentTenantId(id),
      setSidebarOpen,
      addProject,
      updateProjectStatus,
      toggleTheme,
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
