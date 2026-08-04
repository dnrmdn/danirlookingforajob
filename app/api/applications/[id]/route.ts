import { ApplicationController } from "@/features/applications/controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApplicationController.getById(req, { params: await params });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApplicationController.update(req, { params: await params });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return ApplicationController.delete(req, { params: await params });
}
