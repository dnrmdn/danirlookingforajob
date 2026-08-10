import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./index";
import { ActivityLogEntry } from "@/lib/types";

export const activityKeys = {
    all: ["activity"] as const,
    application: (applicationId: string) =>
        [...activityKeys.all, applicationId] as const,
};

export const useApplicationActivity = (applicationId: string) => {
    return useQuery<ActivityLogEntry[]>({
        queryKey: activityKeys.application(applicationId),
        queryFn: () =>
            apiClient.get<ActivityLogEntry[]>(
                `/applications/${applicationId}/activity`
            ),
        enabled: !!applicationId,
    });
};