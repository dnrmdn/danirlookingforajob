import { ReminderController } from "@/features/reminders/controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ReminderController.getByApplication(req, { params: await params });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ReminderController.create(req, { params: await params });
}
