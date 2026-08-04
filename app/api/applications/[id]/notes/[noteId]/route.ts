import { NoteController } from "@/features/notes/controller";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; noteId: string }> }) {
  return NoteController.update(req, { params: await params });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; noteId: string }> }) {
  return NoteController.delete(req, { params: await params });
}
