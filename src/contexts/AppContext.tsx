import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProjects, useTenant } from '@/hooks/useSupabase';
import type { Project, Tenant } from '@/lib/types';

type Theme = 'light' | 'dark';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface AppState {
  currentTenant: Tenant;
  viewMode: 'architect' | 'client';
  sidebarOpen: boolean;
  projects: Project[];
  projectsLoading: boolean;
  notifications: Notification[];
  theme: Theme;
  setViewMode: (mode: 'architect' | 'client') => void;
  setSidebarOpen: (open: boolean) => void;
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Promise<{ error: any }>;
  updateProject: (id: string, data: Partial<Project>) => Promise<{ error: any }>;
  deleteProject: (id: string) => Promise<{ error: any }>;
  refetchProjects: () => Promise<void>;
  toggleTheme: () => void;
}

const defaultTenant: Tenant = { id: 'tenant-1', name: 'ArchiUrban', logo: 'AU', primary_color: '#1e3a5f' };

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<'architect' | 'client'>('architect');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('archi-theme') as Theme) || 'light';
    }
    return 'light';
  });

  const { tenant } = useTenant();
  const { projects, loading: projectsLoading, addProject, updateProject, deleteProject, refetch: refetchProjects } = useProjects();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('archi-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const currentTenant = tenant || defaultTenant;

  const notifications: Notification[] = [];

  return (
    <AppContext.Provider value={{
      currentTenant,
      viewMode,
      sidebarOpen,
      projects,
      projectsLoading,
      notifications,
      theme,
      setViewMode,
      setSidebarOpen,
      addProject,
      updateProject,
      deleteProject,
      refetchProjects,
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
