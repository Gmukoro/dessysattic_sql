//auth.ts

import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/utils/verificationSchema";
import {
  getUserByEmail,
  getAdminEmails,
  compareUserPassword,
} from "@/lib/models/user";

export interface SessionUserProfile {
  tostring(id: string): number;
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: { id: string; url: string };
  verified: boolean;
}

declare module "next-auth" {
  interface Session {
    user: SessionUserProfile;
  }
}

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  debug: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // authorize callback
      async authorize(credentials: any) {
        const result = signInSchema.safeParse(credentials);
        if (!result.success) {
          throw new CredentialsSignin(
            "Please provide a valid email & password!"
          );
        }

        const { email, password } = result.data;
        let user = await getUserByEmail(email);
        console.log("user:", email);

        if (!user) {
          throw new CredentialsSignin("User not found.");
        }
        if (!user.password || typeof user.password !== "string") {
          throw new CredentialsSignin("Password not set or invalid.");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log("passwordMatch:", passwordMatch);
        if (!passwordMatch) {
          throw new CredentialsSignin("Incorrect email or password.");
        }

        // Role handling for admin users
        const adminEmails = await getAdminEmails(email);
        let role = "user";
        if (adminEmails.includes(email)) {
          role = "admin";
        }
        if (!user || !user.id) {
          throw new CredentialsSignin("User or User ID is missing.");
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          role: role,
          verified: user.verified,
          avatar: user.avatar?.url,
        };
      },
    }),
  ],

  secret: process.env.AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "credentials") {
        return true;
      }
      return false;
    },
    // jwt callback
    async jwt({ token, user, trigger, session }) {
      if (user) {
        if (!user.email) {
          throw new Error("User email is missing.");
        }

        const adminEmails = await getAdminEmails(user.email);
        if (adminEmails.includes(user.email)) {
          token.role = "admin";
        }

        // Fetch user data from the database
        const dbUser = await getUserByEmail(user.email);

        if (!dbUser || !dbUser.id) {
          throw new Error("User ID is not valid or not found.");
        }

        token = {
          ...token,
          id: dbUser.id!,
          email: dbUser.email,
          name: dbUser.name,
          role: dbUser.role,
          verified: dbUser.verified || false,
          avatar: dbUser.avatar?.url || "",
        };
      }

      if (trigger === "update") {
        token = { ...token, ...session };
      }
      console.log(token);
      return token;
    },

    session({ token, session }) {
      let user = token as typeof token & SessionUserProfile;

      if (token.user) {
        user = token.user as any;
      }

      if (user) {
        session.user = {
          ...session.user,
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          verified: user.verified,
          avatar: user.avatar,
        };
      }

      return session;
    },
  },
});
