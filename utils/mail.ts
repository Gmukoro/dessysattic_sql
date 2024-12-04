import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Configure email transport
const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "defaultHost",
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "defaultUser",
    pass: process.env.EMAIL_PASS || "defaultPass",
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
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
  return token;
};

// Send verification email
const sendVerificationMail = async (options: Options) => {
  const verificationLink = `${
    process.env.BASE_URL || "http://localhost:3000"
  }/verify-email?token=${options.token}`;

  await transport.sendMail({
    to: options.to,
    from: `"DSY Clothing(dessysattic)" <${process.env.EMAIL_USER}>`,
    subject: "Welcome to Our App!",
    html: `<div>
            <p>Hello ${options.name},</p>
            <p>Please click on <a href="${verificationLink}">this link</a> to verify your email.</p>
        </div>`,
  });
};

// Send password reset email
const sendPassResetMail = async (options: Options) => {
  const resetPasswordLink = `${
    process.env.BASE_URL || "http://localhost:3000"
  }/reset-password?token=${options.token}`;

  await transport.sendMail({
    to: options.to,
    from: `"DSY Clothing(dessysattic)" <${process.env.EMAIL_USER}>`,
    subject: "Password Reset Request",
    html: `<div>
            <p>Hello ${options.name},</p>
            <p>Please click on <a href="${resetPasswordLink}">this link</a> to reset your password.</p>
        </div>`,
  });
};

// Export mail functions
const mail = {
  sendVerificationMail,
  sendPassResetMail,
};

export default mail;
