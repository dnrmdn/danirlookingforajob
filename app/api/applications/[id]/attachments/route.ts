import { AttachmentController } from "@/features/attachments/controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return AttachmentController.getByApplication(req, { params: await params });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return AttachmentController.upload(req, { params: await params });
}
