import { AttachmentController } from "@/features/attachments/controller";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; attachmentId: string }> }) {
  return AttachmentController.delete(req, { params: await params });
}
