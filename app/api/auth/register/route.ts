import { NextRequest } from "next/server";
import { AuthCommandService } from "@/features/auth/command.service";
import { registerSchema } from "@/features/auth/validation";
import { apiResponse } from "@/lib/shared/api-response";
import { ValidationError } from "@/lib/shared/errors";
import { requireRateLimit, authRateLimit } from "@/lib/shared/rate-limit";

const authService = new AuthCommandService();

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limit check
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    await requireRateLimit(`register_${ip}`, authRateLimit);

    // 2. Parse body
    const body = await req.json();

    // 3. Validate and sanitize
    const validationResult = registerSchema.safeParse(body);
    if (!validationResult.success) {
      throw new ValidationError("Invalid registration data", validationResult.error.flatten().fieldErrors);
    }

    // 4. Execute command
    const user = await authService.register(validationResult.data);

    // 5. Return success
    return apiResponse.success(user, "Registration successful", undefined, 201);
  } catch (error) {
    return apiResponse.error(error);
  }
}
