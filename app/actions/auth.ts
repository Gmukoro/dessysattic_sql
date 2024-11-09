"use server";
import { string, z } from "zod";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { Op } from "sequelize";
import UserModel, { createNewUser } from "@/lib/models/user";
import VerificationTokenModel from "@/lib/models/verificationToken";
import {
  passwordValidationSchema,
  signInSchema,
} from "@/utils/verificationSchema";
import { auth, signIn, unstable_update } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import mail from "@/utils/mail";
import { uploadFileToCloud } from "@/utils/fileHandler";
import PassResetTokenModel from "@/lib/models/passwordResetToken";

// Admin email addresses
const admin = ["dessysattic@gmail.com", "Omoefeeweka6@gmail.com"];

// Handle verification token with Sequelize/MySQL
const handleVerificationToken = async (user: {
  id: string;
  name: string;
  email: string;
}) => {
  const userId = user.id;
  const token = crypto.randomBytes(36).toString("hex");

  // Delete any existing verification token for the user
  await VerificationTokenModel.destroy({ where: { userId } });
  // Create a new verification token
  await VerificationTokenModel.create({ token, userId });
  const link = `${process.env.VERIFICATION_LINK}?token=${token}&userId=${userId}`;
  await mail.sendVerificationMail({ link, name: user.name, to: user.email });
};

// Validation schema for user sign-up
const signUpSchema = z.object({
  name: z.string().trim().min(3, "Invalid name!"),
  email: z.string().email("Invalid email!"),
  password: z.string().min(8, "Password is too short!"),
});

interface AuthResponse {
  success?: boolean;
  errors?: Record<string, string[] | undefined>;
  error?: string;
}

// User sign-up function with Sequelize
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
    return { success: false, errors: result.error.formErrors.fieldErrors };
  }

  const { email, name, password } = result.data;

  // Check if user exists in MySQL database
  const oldUser = await UserModel.findOne({ where: { email } });
  if (oldUser) return { success: false, error: "User already exists!" };

  // Create a new user in MySQL
  const user = await createNewUser({
    name,
    email,
    password,
    provider: "credentials",
    verified: false,
  });

  // Handle sending verification link
  await handleVerificationToken({ email, id: user.id.toString(), name });

  await signIn("credentials", { email, password, redirectTo: "/" });

  return { success: true };
};

// Sign-in function with error handling using Sequelize
export const continueWithCredentials = async (
  state: AuthResponse,
  data: FormData
): Promise<AuthResponse> => {
  try {
    const result = signInSchema.safeParse({
      email: data.get("email"),
      password: data.get("password"),
    });
    if (!result.success)
      return { success: false, errors: result.error.formErrors.fieldErrors };

    const { email, password } = result.data;

    // Sign the user in
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
    return { success: true };
  } catch (error) {
    let errorMsg = "";
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      redirect("/");
    } else if (error instanceof AuthError) {
      errorMsg = error.message;
    } else {
      errorMsg = (error as any).message;
    }
    return { error: errorMsg, success: false };
  }
};

// Generate verification link function with Sequelize
export const generateVerificationLink = async (): Promise<{
  success: boolean;
}> => {
  const session = await auth();
  if (!session) return { success: false };

  const user = await UserModel.findByPk(session.user.id);
  if (user?.verified) {
    return { success: false };
  }

  const { email, id, name } = session.user;
  await handleVerificationToken({ email, id: id.toString(), name });
  return { success: true };
};

// Update profile information function with Sequelize
export const updateProfileInfo = async (data: FormData) => {
  const session = await auth();
  if (!session) return { success: false, error: "User not authenticated." };

  const userInfo: { name?: string; avatar?: { id: string; url: string } } = {};
  const name = data.get("name");
  const avatar = data.get("avatar");

  if (typeof name === "string" && name.trim().length >= 3) {
    userInfo.name = name;
  } else {
    return {
      success: false,
      error: "Invalid name. Please provide a valid name.",
    };
  }

  if (avatar instanceof Blob && avatar.type.startsWith("image/")) {
    const result = await uploadFileToCloud(avatar);
    if (result) {
      userInfo.avatar = { id: result.public_id, url: result.secure_url };
    }
  }

  await UserModel.update(userInfo, {
    where: { id: session.user.id },
  });

  await unstable_update({
    user: {
      ...session.user,
      name: userInfo.name,
      avatar: userInfo.avatar?.url,
    },
  });

  return { success: true };
};

// Generate password reset link with Sequelize
export const generatePassResetLink = async (
  state: { message?: string; error?: string },
  formData: FormData
): Promise<{ message?: string; error?: string }> => {
  const email = formData.get("email");

  if (typeof email !== "string") return { error: "Invalid email!" };

  const message = "If we found your profile, we will send you the link!";
  const user = await UserModel.findOne({
    where: { email, provider: "credentials" },
  });

  if (!user) return { message };

  const userId = user.id;
  const token = crypto.randomBytes(36).toString("hex");

  // Handle token creation and email sending
  await PassResetTokenModel.destroy({ where: { userId } });
  await PassResetTokenModel.create({ token, userId });
  const link = `${process.env.PASS_RESET_LINK}?token=${token}&userId=${userId}`;
  await mail.sendPassResetMail({ link, name: user.name, to: user.email });

  return { message };
};


// Update password function with validation using Sequelize
export const updatePassword = async (data: FormData): Promise<AuthResponse> => {
  const fields = ["one", "two", "token", "userId"];
  const incomingData: Record<string, any> = {};
  for (const field of fields) {
    incomingData[field] = data.get(field);
  }

  const result = passwordValidationSchema.safeParse(incomingData);
  if (!result.success) return { success: false, error: "Invalid Password!" };

  const { userId, token, one } = result.data;
  const resetToken = await PassResetTokenModel.findOne({ where: { userId } });
  if (!resetToken || resetToken.token !== token) {
    return { success: false, error: "Invalid request!" };
  }

  const user = await UserModel.update(
    { password: one },
    { where: { id: userId } }
  );
  if (!user) return { success: false, error: "User not found!" };

  // Delete the reset token after use
  await PassResetTokenModel.destroy({ where: { userId } });

  return { success: true };
};

// Admin redirect logic
export const redirectAdmin = async () => {
  const session = await auth();
  if (!session) return redirect("/sign-in");

  const userEmail = session.user.email;
  if (admin.includes(userEmail)) {
    return redirect("/admin");
  } else {
    return redirect("/");
  }
};
