import { AnalyticsController } from "@/features/analytics/controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return AnalyticsController.getDashboardStats(req);
}
