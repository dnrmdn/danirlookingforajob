import { ReminderController } from "@/features/reminders/controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return ReminderController.getAll(req);
}
