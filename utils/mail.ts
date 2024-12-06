import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Configure email transport
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: true, // Use SSL/TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Type for email options
type Options = {
  to: string;
  name: string;
  link?: string;
  token: string;
};

// Generate a JWT token
const generateToken = (email: string, userId?: number) => {
  const payload = { email, userId };
  const token = jwt.sign(payload, process.env.NEXTAUTH_SECRET!, {
    expiresIn: "15m",
  });
  return token;
};

// Send verification email
const sendVerificationMail = async (options: Options) => {
  const verificationLink = `${process.env.BASE_URL}/verify-email?token=${options.token}`;

  try {
    await transport.sendMail({
      to: options.to,
      from: `"DSY Clothing (dessysattic)" <${process.env.EMAIL_USER}>`,
      subject: "Welcome to DSY Clothing!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Welcome, ${options.name}!</h2>
          <p>Thank you for signing up for DSY Clothing.</p>
          <p>
            Please verify your email by clicking the link below:
            <a href="${verificationLink}" style="color: blue;">Verify Email</a>
          </p>
          <p>We hope you enjoy your shopping experience with us!</p>
        </div>
      `,
    });
    console.log(`Verification email sent to ${options.to}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to send verification email: ${error.message}`);
    } else {
      console.error(
        "An unknown error occurred while sending the verification email."
      );
    }
    throw new Error("Failed to send verification email");
  }
};

// Send password reset email
const sendPassResetMail = async (options: Options) => {
  const resetPasswordLink = `${process.env.BASE_URL}/reset-password?token=${options.token}`;

  try {
    await transport.sendMail({
      to: options.to,
      from: `"DSY Clothing (dessysattic)" <${process.env.EMAIL_USER}>`,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Hello, ${options.name}</h2>
          <p>We received a request to reset your password.</p>
          <p>
            Click the link below to reset your password:
            <a href="${resetPasswordLink}" style="color: blue;">Reset Password</a>
          </p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });
    console.log(`Password reset email sent to ${options.to}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to send password reset email: ${error.message}`);
    } else {
      console.error(
        "An unknown error occurred while sending the password reset email."
      );
    }
    throw new Error("Failed to send password reset email");
  }
};

// Export mail functions
const mail = {
  sendVerificationMail,
  sendPassResetMail,
};

export default mail;
