import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './index';
import { ApplicationSummaryResponse, ApplicationDetailResponse, CreateApplicationRequest, UpdateApplicationRequest } from '@/features/applications/dto';

export const applicationsKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationsKeys.all, 'list'] as const,
  list: (filters: string) => [...applicationsKeys.lists(), { filters }] as const,
  details: () => [...applicationsKeys.all, 'detail'] as const,
  detail: (id: string) => [...applicationsKeys.details(), id] as const,
};

export const useApplications = (params?: { take?: number; cursor?: string; status?: string }) => {
  return useQuery({
    queryKey: applicationsKeys.list(JSON.stringify(params)),
    queryFn: () => apiClient.get<ApplicationSummaryResponse[]>('/applications', { params }),
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: applicationsKeys.detail(id),
    queryFn: () => apiClient.get<ApplicationDetailResponse>(`/applications/${id}`),
    enabled: !!id,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateApplicationRequest) => apiClient.post<ApplicationDetailResponse>('/applications', { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationsKeys.lists() });
    },
  });
};

export const useUpdateApplication = (id: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UpdateApplicationRequest) => apiClient.patch<ApplicationDetailResponse>(`/applications/${id}`, { data }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: applicationsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: applicationsKeys.lists() });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/applications/${id}`),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: applicationsKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: applicationsKeys.lists() });
    },
  });
};
