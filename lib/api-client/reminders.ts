import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './index';
import { ReminderResponse, CreateReminderRequest, UpdateReminderRequest } from '@/features/reminders/dto';

export const remindersKeys = {
  all: ['reminders'] as const,
  byApp: (appId: string) => ['applications', appId, 'reminders'] as const,
};

export const useAllReminders = () => {
  return useQuery({
    queryKey: remindersKeys.all,
    queryFn: () => apiClient.get<ReminderResponse[]>('/reminders'),
  });
};

export const useAppReminders = (applicationId: string) => {
  return useQuery({
    queryKey: remindersKeys.byApp(applicationId),
    queryFn: () => apiClient.get<ReminderResponse[]>(`/applications/${applicationId}/reminders`),
    enabled: !!applicationId,
  });
};

export const useCreateReminder = (applicationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateReminderRequest) => apiClient.post<ReminderResponse>(`/applications/${applicationId}/reminders`, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: remindersKeys.byApp(applicationId) });
      queryClient.invalidateQueries({ queryKey: remindersKeys.all });
    },
  });
};

export const useUpdateReminder = (applicationId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    // Needs to handle if it's updated from the global view or app view
    mutationFn: ({ reminderId, data }: { reminderId: string, data: UpdateReminderRequest }) => {
      // Assuming our API allows updating via the app endpoint for simplicity here
      const url = applicationId 
        ? `/applications/${applicationId}/reminders/${reminderId}`
        : `/reminders/${reminderId}`; // Depending on routing setup
      return apiClient.patch<ReminderResponse>(`/applications/${applicationId}/reminders/${reminderId}`, { data });
    },
    onSuccess: () => {
      if (applicationId) queryClient.invalidateQueries({ queryKey: remindersKeys.byApp(applicationId) });
      queryClient.invalidateQueries({ queryKey: remindersKeys.all });
    },
  });
};

export const useDeleteReminder = (applicationId?: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (reminderId: string) => apiClient.delete(`/applications/${applicationId}/reminders/${reminderId}`),
    onSuccess: () => {
      if (applicationId) queryClient.invalidateQueries({ queryKey: remindersKeys.byApp(applicationId) });
      queryClient.invalidateQueries({ queryKey: remindersKeys.all });
    },
  });
};
