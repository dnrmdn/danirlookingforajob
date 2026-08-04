import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './index';
import { NoteResponse, CreateNoteRequest, UpdateNoteRequest } from '@/features/notes/dto';

export const notesKeys = {
  all: (appId: string) => ['applications', appId, 'notes'] as const,
};

export const useNotes = (applicationId: string) => {
  return useQuery({
    queryKey: notesKeys.all(applicationId),
    queryFn: () => apiClient.get<NoteResponse[]>(`/applications/${applicationId}/notes`),
    enabled: !!applicationId,
  });
};

export const useCreateNote = (applicationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateNoteRequest) => apiClient.post<NoteResponse>(`/applications/${applicationId}/notes`, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.all(applicationId) });
    },
  });
};

export const useUpdateNote = (applicationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ noteId, data }: { noteId: string, data: UpdateNoteRequest }) => 
      apiClient.patch<NoteResponse>(`/applications/${applicationId}/notes/${noteId}`, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.all(applicationId) });
    },
  });
};

export const useDeleteNote = (applicationId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (noteId: string) => apiClient.delete(`/applications/${applicationId}/notes/${noteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notesKeys.all(applicationId) });
    },
  });
};
