import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/utils/verificationSchema";
import { getUserByEmail, getAdminEmails } from "@/lib/models/user";

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

        // Check if the user exists and is a valid object
        if (!user || !user.id || !user.password) {
          throw new Error("User not found or invalid object");
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new Error("Incorrect email or password!");
        }

        // Ensure correct admin role handling
        const adminEmails = await getAdminEmails(email);
        let role = "user";
        if (adminEmails.includes(email)) {
          role = "admin";
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

  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
  },

  callbacks: {
    // async signIn({ account, profile }) {
    //   if (account?.provider === "credentials") {
    //     return true;
    //   }
    //   return false;
    // },
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

        // Check if the user exists and their ID is valid
        if (!dbUser || !dbUser.id) {
          throw new Error("User ID is not valid or not found.");
        }

        token = {
          ...token,
          id: dbUser.id,
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
