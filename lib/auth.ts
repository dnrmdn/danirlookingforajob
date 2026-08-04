import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthCommandService } from "@/features/auth/command.service";
import { authConfig } from "./auth.config";
import { env } from "./env";

/**
 * Full NextAuth configuration with Credentials provider.
 * This file imports Node.js-only modules (prisma, bcryptjs) and must
 * ONLY be used on the server side (API routes, server components).
 * 
 * For Edge/middleware usage, import from ./auth.config instead.
 */

const authService = new AuthCommandService();

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await authService.verifyCredentials({
            email: credentials.email as string,
            password: credentials.password as string
          });
          
          return user; 
        } catch (error) {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: env.NEXTAUTH_SECRET,
});

export const requireAuth = async () => {
  const session = await auth();
  if (!session?.user) {
    throw new Error('Unauthorized');
  }
  return (session.user as any).id as string;
};
