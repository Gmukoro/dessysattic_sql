"use server";

import { z } from "zod";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import {
  createUser,
  getUserByEmail,
  updateUser,
  getUserById,
  compareUserPassword,
} from "@/lib/models/user";
import {
  createVerificationToken,
  getTokenByUserId,
  cleanupExpiredTokens,
  compareToken,
} from "@/lib/models/verificationToken";
import {
  createPasswordResetToken,
  comparePasswordResetToken,
  deleteByUserId,
} from "@/lib/models/passwordResetToken";
import {
  passwordValidationSchema,
  signInSchema,
} from "@/utils/verificationSchema";
import { auth, signIn, unstable_update } from "@/auth";
import { redirect } from "next/navigation";
import mail from "@/utils/mail";
import { uploadFileToCloud } from "@/utils/fileHandler";
import { v4 as uuidv4 } from "uuid";

// Admin email list
const adminEmails = ["dessysattic@gmail.com", "Omoefeeweka6@gmail.com"];

interface AuthResponse {
  success?: boolean;
  errors?: Record<string, string[] | undefined>;
  error?: string;
}

// Utility: Create and send verification token
const handleVerificationToken = async (user: {
  id: string;
  name: string;
  email: string;
}) => {
  const { id: userId, name, email } = user;
  const token = crypto.randomBytes(36).toString("hex");

  // Cleanup existing tokens and create a new one
  await cleanupExpiredTokens();
  await createVerificationToken({
    token,
    userId,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  const link = `${process.env.VERIFICATION_LINK}?token=${token}&userId=${userId}`;
  await mail.sendVerificationMail({ link, name, to: email });
};

// Signup
const signUpSchema = z.object({
  name: z.string().trim().min(3, "Invalid name!"),
  email: z.string().email("Invalid email!"),
  password: z.string().min(8, "Password is too short!"),
});

export const signUp = async (state: AuthResponse, data: FormData) => {
  const result = signUpSchema.safeParse({
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
  });

  if (!result.success) {
    // Make sure to return errors in the correct format
    return {
      success: false,
      errors: result.error.formErrors.fieldErrors,
      error: undefined,
    };
  }

  const { name, email, password } = result.data;
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      success: false,
      error: "User already exists!",
      errors: undefined, // Ensure this is undefined as error is present
    };
  }

  const user = await createUser({
    name,
    email,
    password: bcrypt.hashSync(password, 10),
    verified: false,
    wishlist: [],
  });

  await handleVerificationToken({ id: "user.id", name, email });
  await signIn("credentials", { email, password, redirectTo: "/" });

  return {
    success: true,
    errors: undefined,
  };
};

export const continueWithCredentials = async (
  state: AuthResponse,
  data: FormData
): Promise<AuthResponse> => {
  try {
    // Validate the data against the schema
    const result = signInSchema.safeParse({
      email: data.get("email"),
      password: data.get("password"),
    });

    if (!result.success) {
      return { success: false, errors: result.error.formErrors.fieldErrors };
    }

    const { email, password } = result.data;

    // Check if the user exists and if the password matches
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    const isPasswordValid = await compareUserPassword(email, password);
    if (!isPasswordValid) {
      return { success: false, error: "Incorrect password" };
    }

    // Sign the user in using NextAuth.js
    await signIn("credentials", { email, password, redirectTo: "/" });

    return { success: true };
  } catch (error) {
    let errorMsg = "";
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      // Handle the redirect error in a specific way if needed
      errorMsg = "Redirect error, please try again.";
    } else {
      errorMsg = (error as any).message || "Unknown error occurred.";
    }

    return { success: false, error: errorMsg };
  }
};

interface VerificationResponse {
  success?: boolean;
}
export const generateVerificationLink = async (
  state: VerificationResponse
): Promise<VerificationResponse> => {
  const session = await auth();
  if (!session) return { success: false };

  const { email, id, name } = session.user;

  // Fetch user details from the database
  const user = await getUserById(id);
  if (!user) {
    return { success: false };
  }

  // Check if the user is already verified
  if (user.verified) {
    // User is already verified
    return { success: false };
  }

  // Check if a token already exists for the user
  const existingToken = await getTokenByUserId(id);
  if (existingToken) {
    // If the token already exists and is valid, return success
    return { success: true };
  }

  // Generate a new verification token and store it
  const token = uuidv4();
  const expirationTime = new Date(Date.now() + 3600000);

  // Create the verification token
  await createVerificationToken({
    token,
    userId: id,
    expires: expirationTime,
  });

  return { success: true };
};

export const updateProfileInfo = async (data: FormData) => {
  const session = await auth();
  if (!session) return;

  const userInfo: { name?: string; avatar?: { id: string; url: string } } = {};

  const name = data.get("name");
  const avatar = data.get("avatar");

  // Validate and update name if necessary
  if (typeof name === "string" && name.trim().length >= 3) {
    userInfo.name = name;
  }

  // Validate and upload the avatar if it's a valid image file
  if (avatar instanceof File && avatar.type.startsWith("image")) {
    const result = await uploadFileToCloud(avatar);
    if (result) {
      userInfo.avatar = { id: result.public_id, url: result.secure_url };
    }
  }

  // Update the user's data in MySQL database
  await updateUser(session.user.id, userInfo);

  // Update session data with new user info
  await unstable_update({
    user: {
      ...session.user,
      name: userInfo.name,
      avatar: userInfo.avatar?.url,
    },
  });
};

// Generate password reset link
export const generatePassResetLink = async (
  state: { message?: string; error?: string },
  formData: FormData
) => {
  const email = formData.get("email");
  if (typeof email !== "string") return { error: "Invalid email!" };

  const message = "If we found your profile, we sent you the link!";
  const user = await getUserByEmail(email);
  if (!user) return { message };

  const token = crypto.randomBytes(36).toString("hex");
  await deleteByUserId(user.id);
  await createPasswordResetToken({
    token,
    userId: user.id,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  const link = `${process.env.PASS_RESET_LINK}?token=${token}&userId=${user.id}`;
  await mail.sendPassResetMail({ link, name: user.name, to: email });

  return { message };
};

// Update password
export const updatePassword = async (
  state: { success?: boolean; error?: string },
  data: FormData
) => {
  const fields = ["one", "two", "token", "userId"];
  const incomingData = Object.fromEntries(
    fields.map((field) => [field, data.get(field)])
  );

  const result = passwordValidationSchema.safeParse(incomingData);
  if (!result.success) return { success: false, error: "Invalid Password!" };

  const { one, token, userId } = result.data;
  const resetToken = await comparePasswordResetToken(userId, token);

  if (!resetToken) return { success: false, error: "Invalid request!" };

  const user = await getUserById(userId);
  if (!user) return { success: false, error: "User not found!" };

  await updateUser(userId, { password: bcrypt.hashSync(one, 10) });
  await deleteByUserId(resetToken.id);

  return { success: true };
};

// Admin redirect
export const redirectAdmin = async () => {
  const session = await auth();
  if (!session) return redirect("/sign-in");

  if (adminEmails.includes(session.user.email)) return redirect("/admin");
  return redirect("/");
};
