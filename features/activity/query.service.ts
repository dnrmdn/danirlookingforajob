import { ActivityRepository } from "./repository";
import { toActivityLogEntry } from "./mapper";
import { ActivityLogEntry } from "@/lib/types";

export class ActivityQueryService {
    private repository = new ActivityRepository();

    async getApplicationActivity(
        applicationId: string
    ): Promise<ActivityLogEntry[]> {
        const activities = await this.repository.findByEntity(
            "Application",
            applicationId
        );

        return activities.map(toActivityLogEntry);
    }
}