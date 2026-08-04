import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './index';
import { AttachmentResponse } from '@/features/attachments/dto';

export const attachmentsKeys = {
  all: (appId: string) => ['applications', appId, 'attachments'] as const,
};

export const useAttachments = (applicationId: string) => {
  return useQuery({
    queryKey: attachmentsKeys.all(applicationId),
    queryFn: () => apiClient.get<AttachmentResponse[]>(`/applications/${applicationId}/attachments`),
    enabled: !!applicationId,
  });
};

export const useUploadAttachment = (applicationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      return apiClient.post<AttachmentResponse>(`/applications/${applicationId}/attachments`, {
        data: formData, // the client handles skipping content-type for FormData
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attachmentsKeys.all(applicationId) });
    },
  });
};

export const useDeleteAttachment = (applicationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (attachmentId: string) => apiClient.delete(`/applications/${applicationId}/attachments/${attachmentId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: attachmentsKeys.all(applicationId) });
    },
  });
};
