import { NextRequest } from "next/server";
import { getApplicationActivityController } from "@/features/activity/controller";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    return getApplicationActivityController(req, {
        params: await params,
    });
}