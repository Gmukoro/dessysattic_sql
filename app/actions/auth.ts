"use server";

import z from "zod";
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
import router, { useRouter } from "next/router";
import mail from "@/utils/mail";
import { uploadFileToCloud } from "@/utils/fileHandler";
import { v4 as uuidv4 } from "uuid";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

// Admin email list
const adminEmails = ["dessysattic@gmail.com", "Omoefeeweka6@gmail.com"];

interface AuthResponse {
  success?: boolean;
  errors?: Record<string, string[]>;
  error?: string;
}
// Utility function for response
const sendResponse = (status: number, data: any) => ({ status, data });

// Utility: Create and send verification token
const handleVerificationToken = async (user: {
  id: number;
  name: string;
  email: string;
}) => {
  const token = crypto.randomBytes(36).toString("hex");

  // Cleanup existing tokens and create a new one
  await cleanupExpiredTokens(user.id);
  await createVerificationToken({
    token,
    userId: user.id,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const link = `${process.env.VERIFICATION_LINK}?token=${token}&userId=${user.id}`;

  // Pass token along with other required fields
  await mail.sendVerificationMail({
    link,
    name: user.name,
    to: user.email,
    token, // Add the token here
  });
};

// Signup
const signUpSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Invalid email format."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const signUp = async (
  state: AuthResponse,
  data: FormData
): Promise<AuthResponse> => {
  const result = signUpSchema.safeParse({
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.formErrors.fieldErrors,
    };
  }

  const { name, email, password } = result.data;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { success: false, error: "User already exists!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    provider: "credentials",
    verified: false,
  });

  // Ensure user is not null before passing it to handleVerificationToken
  if (user && user.id && user.name && user.email) {
    await handleVerificationToken(user);
  } else {
    return { success: false, error: "User creation failed or incomplete." };
  }

  await signIn("credentials", { email, password, redirectTo: "/" });

  return { success: true };
};

export const continueWithCredentials = async (
  state: AuthResponse,
  data: FormData
): Promise<AuthResponse> => {
  const result = signInSchema.safeParse({
    email: data.get("email"),
    password: data.get("password"),
  });

  if (!result.success) {
    return { success: false, errors: result.error.formErrors.fieldErrors };
  }

  const { email, password } = result.data;

  // Ensure password is defined and of type string
  if (typeof password !== "string") {
    return { success: false, error: "Password is required." };
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return { success: false, error: "User not found." };
  }

  // Ensure that the password in the user object is defined and a string
  if (typeof user.password !== "string") {
    return { success: false, error: "User password is invalid." };
  }

  // Now, password and user.password are both guaranteed to be strings
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return { success: false, error: "Incorrect password." };
  }

  await signIn("credentials", { email, password });
  return { success: true };
};

interface VerificationResponse {
  success?: boolean;
}

export const generateVerificationLink =
  async (): Promise<VerificationResponse> => {
    const session = await auth();
    if (!session) return { success: false };

    const userId = Number(session.user.id);
    if (isNaN(userId)) return { success: false };

    const user = await getUserById(userId);
    if (!user || user.verified) {
      return { success: user?.verified || false };
    }

    const token = uuidv4();
    await createVerificationToken({
      token,
      userId,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });

    return { success: true };
  };

export const updateProfileInfo = async (data: FormData) => {
  const session = await auth();
  if (!session) return;

  const userInfo: { name?: string; avatar?: { id: string; url: string } } = {};

  const name = data.get("name");
  if (typeof name === "string" && name.trim().length >= 3) {
    userInfo.name = name.trim();
  }

  const avatar = data.get("avatar");
  if (avatar instanceof File && avatar.type.startsWith("image")) {
    const result = await uploadFileToCloud(avatar);
    if (result) {
      userInfo.avatar = { id: result.public_id, url: result.secure_url };
    }
  }

  const userId = Number(session.user.id);

  await updateUser(userId, userInfo);
  await unstable_update({
    user: {
      ...session.user,
      ...userInfo,
    },
  });
};

// Generate password reset link
export const generatePassResetLink = async (
  state: { message?: string; error?: string },
  formData: FormData
): Promise<{ message: string; error?: string; success?: boolean }> => {
  const email = formData.get("email");
  const userId = Number(formData.get("userId"));

  if (typeof email !== "string" || isNaN(userId)) {
    return { error: "Invalid email or userId!", message: "" };
  }

  const message = "If we found your profile, we sent you the link!";
  const user = await getUserByEmail(email);
  if (!user) {
    return { message };
  }

  if (!user.id) {
    return { error: "User ID is invalid!", message: "" };
  }

  const token = crypto.randomBytes(36).toString("hex");

  await deleteByUserId(user.id);
  await createPasswordResetToken({
    token,
    userId: user.id,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  });

  const link = `${process.env.PASS_RESET_LINK}?token=${token}&userId=${user.id}`;
  try {
    await mail.sendPassResetMail({
      link,
      name: user.name,
      to: email,
      token: "",
    });
  } catch (error) {
    return { error: "Failed to send password reset email.", message: "" };
  }

  return { message, success: true };
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

  const user = await getUserById(Number(userId));
  if (!user)
    return {
      success: false,
      error: "Could not update password, User not found!",
    };

  // Corrected the usage of 'Number' here
  await updateUser(Number(userId), { password: bcrypt.hashSync(one, 10) });

  // Corrected the call to deleteByUserId
  await deleteByUserId(Number(user.id));

  return { success: true };
};
