//app\actions\auth.ts

import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/utils/verificationSchema";
import { getUserByEmail } from "@/lib/models/user";

export interface SessionUserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  verified: boolean;
}

declare module "next-auth" {
  interface Session {
    user: SessionUserProfile;
  }
}

class CustomError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.message = message;
  }
  code = "custom_error";
}

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials: any) {
        const result = signInSchema.safeParse(credentials);
        if (!result.success) {
          throw new Error("Please provide a valid email & password!");
        }

        const { email, password } = result.data;

        // Fetch user from the database
        const user = await getUserByEmail(email);
        console.log("Fetched User:", user);
        if (
          !user ||
          !user.password ||
          !bcrypt.compareSync(password, user.password)
        ) {
          throw new Error("Email/Password mismatched!");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          verified: user.verified,
          avatar: user.avatar?.url,
        };
      },
    }),
  ],
  secret: process.env.JWT_SECRET, // Use the JWT_SECRET from env
  session: {
    strategy: "jwt", // Set the strategy to JWT
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log("JWT Callback Triggered:", { token, user, trigger });
      if (user) {
        // Ensure user.email is defined
        if (!user.email) {
          throw new Error("User email is missing.");
        }

        // Fetch user data from the database
        const dbUser = await getUserByEmail(user.email);
        if (dbUser) {
          console.log("User from DB:", dbUser);
          token = {
            ...token,
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            verified: dbUser.verified || false,
            avatar: dbUser.avatar?.url || "",
          };
        }
      }

      if (trigger === "update") {
        token = { ...token, ...session };
      }
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
          verified: user.verified,
          avatar: user.avatar,
        };
      }
      console.log(session);
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    error: "/error",
  },
});
