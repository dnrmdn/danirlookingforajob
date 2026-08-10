import { NextRequest } from "next/server";
import { apiResponse } from "@/lib/shared/api-response";
import { ActivityQueryService } from "./query.service";

const service = new ActivityQueryService();

export async function getApplicationActivityController(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const activity = await service.getApplicationActivity(params.id);

        return apiResponse.success(activity);
    } catch (error) {
        console.error(error);

        return apiResponse.error("Failed to fetch activity");
    }
}