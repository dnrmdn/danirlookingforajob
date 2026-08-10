import NextAuth from "next-auth"
import { authConfig } from "@/lib/auth.config"

/**
 * Edge middleware for authentication.
 * Imports ONLY from auth.config.ts (edge-safe, no Node.js modules).
 */
export default NextAuth(authConfig).auth

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
