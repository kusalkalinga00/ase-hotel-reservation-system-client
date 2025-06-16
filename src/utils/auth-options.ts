import { login } from "@/services/auth.services";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await login(credentials.email, credentials.password);

          if (response.success && response.payload) {
            const token = response.payload.token;
            const user = response.payload.user;
            const refreshToken = response.payload.refreshToken;

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              accessToken: token,
              refreshToken: refreshToken,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // logged in
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.email = user.email;
        token.id = user.id;
        token.name = user.name;
        token.role = user.role;
        return token;
      }

      if (trigger === "update" && session?.accessToken) {
        token.accessToken = session.accessToken;
        token.refreshToken = session.refreshToken;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
        };

        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
