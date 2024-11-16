import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "defaultHost",
  port: parseInt(process.env.EMAIL_PORT || "465"),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "defaultUser",
    pass: process.env.EMAIL_PASS || "defaultPass",
  },
});

type Options = {
  [x: string]: any;
  to: string;
  name: string;
  link: string;
};

const generateToken = (email: string) => {
  const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  });
  return token;
};

const sendVerificationMail = async (options: Options) => {
  const verificationLink = `${
    process.env.BASE_URL || "http://localhost:3000"
  }/verify-email?token=${options.token}`;

  await transport.sendMail({
    to: options.to,
    from: process.env.EMAIL_USER,
    subject: "Welcome Email",
    html: `<div>
            <p>Please click on <a href="${verificationLink}">this link</a> to verify your email.</p>
        </div>`,
  });
};

// Send Password Reset Email
const sendPassResetMail = async (options: Options) => {
  const resetPasswordLink = `${
    process.env.BASE_URL || "http://localhost:3000"
  }/reset-password?token=${options.token}`;

  await transport.sendMail({
    to: options.to,
    from: process.env.EMAIL_USER,
    subject: "Password Reset Request",
    html: `<div>
            <p>Please click on <a href="${resetPasswordLink}">this link</a> to reset your password.</p>
        </div>`,
  });
};

const mail = {
  sendVerificationMail,
  sendPassResetMail,
};

export default mail;
