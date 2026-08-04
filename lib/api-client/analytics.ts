import { useQuery } from '@tanstack/react-query';
import { apiClient } from './index';
import { DashboardStatsResponse } from '@/features/analytics/query.service';

export const analyticsKeys = {
  stats: ['analytics', 'stats'] as const,
};

export const useDashboardStats = () => {
  return useQuery({
    queryKey: analyticsKeys.stats,
    queryFn: () => apiClient.get<DashboardStatsResponse>('/analytics'),
  });
};
