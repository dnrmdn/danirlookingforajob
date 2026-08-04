import { NoteController } from "@/features/notes/controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return NoteController.getByApplication(req, { params: await params });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return NoteController.create(req, { params: await params });
}
