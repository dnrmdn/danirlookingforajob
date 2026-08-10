import { ActivityLog } from "@prisma/client";
import { ActivityLogEntry } from "@/lib/types";

export function toActivityLogEntry(
    activity: ActivityLog
): ActivityLogEntry {
    switch (activity.action) {
        case "CREATED":
            return {
                id: activity.id,
                type: "created",
                description: "Application created",
                createdAt: activity.createdAt.toISOString(),
            };

        case "STATUS_CHANGED":
            return {
                id: activity.id,
                type: "status_change",
                description: "Application status changed",
                fromStatus: (activity.metadata as any)?.from,
                toStatus: (activity.metadata as any)?.to,
                createdAt: activity.createdAt.toISOString(),
            };

        default:
            return {
                id: activity.id,
                type: "created",
                description: activity.action,
                createdAt: activity.createdAt.toISOString(),
            };
    }
}