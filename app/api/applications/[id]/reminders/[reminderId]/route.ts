import { ReminderController } from "@/features/reminders/controller";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; reminderId: string }> }) {
  return ReminderController.update(req, { params: await params });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; reminderId: string }> }) {
  return ReminderController.delete(req, { params: await params });
}
