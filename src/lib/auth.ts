// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const DEMO_ORG_ID = process.env.DEMO_ORG_ID!; 

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      // login ultra simple para dev: solo pide email
      credentials: { email: { label: "Email", type: "text" } },
      async authorize(creds) {
        const email = creds?.email?.toString().trim().toLowerCase();
        // ACEPTA el usuario de tu seed; luego pasamos a Supabase Auth
        if (email === "owner@demo.local") {
          return { id: "demo-user", email, orgId: DEMO_ORG_ID } as any;
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.orgId = (user as any).orgId;
      return token;
    },
    async session({ session, token }) {
      (session as any).orgId = token.orgId as string | undefined;
      return session;
    },
  },
});
