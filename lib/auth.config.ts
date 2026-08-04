import { NextAuthConfig } from "next-auth";

/**
 * Edge-safe NextAuth configuration.
 * This file must NOT import any Node.js-only modules (prisma, bcryptjs, pino, etc.)
 * because it runs in the Edge runtime via middleware.
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [], // Providers are added in auth.ts (server-only)
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnApp = !nextUrl.pathname.startsWith("/login") && !nextUrl.pathname.startsWith("/register");

      if (isOnApp) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
  },
};
