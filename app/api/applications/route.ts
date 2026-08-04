import { ApplicationController } from "@/features/applications/controller";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return ApplicationController.getAll(req);
}

export async function POST(req: NextRequest) {
  return ApplicationController.create(req);
}
