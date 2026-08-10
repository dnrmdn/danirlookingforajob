import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./index";
import {
  ApplicationDetailResponse,
  ApplicationSummaryResponse,
  CreateApplicationRequest,
  UpdateApplicationRequest,
} from "@/features/applications/dto";
import { activityKeys } from "./activity";

export const applicationsKeys = {
  all: ["applications"] as const,

  lists: () => [...applicationsKeys.all, "list"] as const,

  list: (filters?: unknown) =>
    [...applicationsKeys.lists(), filters] as const,

  details: () => [...applicationsKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...applicationsKeys.details(), id] as const,
};

export const useApplications = (params?: {
  take?: number;
  cursor?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: applicationsKeys.list(params),
    queryFn: () =>
      apiClient.get<ApplicationSummaryResponse[]>("/applications", {
        params,
      }),
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: applicationsKeys.detail(id),
    queryFn: () =>
      apiClient.get<ApplicationDetailResponse>(`/applications/${id}`),
    enabled: Boolean(id),
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateApplicationRequest) =>
      apiClient.post<ApplicationDetailResponse>("/applications", {
        data,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: applicationsKeys.lists(),
      });
    },
  });
};

export interface UpdateApplicationVariables {
  id: string;
  data: UpdateApplicationRequest;
}

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdateApplicationVariables) =>
      apiClient.patch<ApplicationDetailResponse>(
        `/applications/${id}`,
        {
          data,
        }
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: applicationsKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: applicationsKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: activityKeys.application(variables.id),
      });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient.delete(`/applications/${id}`),

    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: applicationsKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: applicationsKeys.lists(),
      });
    },
  });
};