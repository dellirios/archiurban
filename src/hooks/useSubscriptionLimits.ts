import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import type { TierKey } from '@/data/stripeTiers';

export interface TierLimits {
  maxProjects: number;
  maxUsers: number;
  crmEnabled: boolean;
  advancedReports: boolean;
  portfolioPremium: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
}

const tierLimitsMap: Record<TierKey | 'free', TierLimits> = {
  free: {
    maxProjects: 2,
    maxUsers: 1,
    crmEnabled: false,
    advancedReports: false,
    portfolioPremium: false,
    apiAccess: false,
    whiteLabel: false,
  },
  basic: {
    maxProjects: 5,
    maxUsers: 3,
    crmEnabled: false,
    advancedReports: false,
    portfolioPremium: false,
    apiAccess: false,
    whiteLabel: false,
  },
  pro: {
    maxProjects: Infinity,
    maxUsers: 10,
    crmEnabled: true,
    advancedReports: true,
    portfolioPremium: true,
    apiAccess: false,
    whiteLabel: false,
  },
  premium: {
    maxProjects: Infinity,
    maxUsers: Infinity,
    crmEnabled: true,
    advancedReports: true,
    portfolioPremium: true,
    apiAccess: true,
    whiteLabel: true,
  },
};

export const useSubscriptionLimits = () => {
  const { subscription } = useAuth();
  const { projects } = useApp();

  const currentTier: TierKey | 'free' = subscription.subscribed && subscription.tier
    ? subscription.tier
    : 'free';

  const limits = tierLimitsMap[currentTier];

  const projectCount = projects.length;
  const canCreateProject = projectCount < limits.maxProjects;
  const projectsRemaining = limits.maxProjects === Infinity
    ? Infinity
    : Math.max(0, limits.maxProjects - projectCount);

  return {
    currentTier,
    limits,
    projectCount,
    canCreateProject,
    projectsRemaining,
    isLoading: subscription.loading,
  };
};
