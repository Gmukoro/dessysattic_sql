// // import nodemailer from "nodemailer";
// // import { MailtrapClient } from "mailtrap";

// // const TOKEN = process.env.MAILTRAP_TOKEN!;

// // const client = new MailtrapClient({ token: TOKEN });

// // const sender = {
// //   email: "no-reply@dessysattic.com",
// //   name: "DSY Team",
// // };

// // const transport = nodemailer.createTransport({
// //   host: "sandbox.smtp.mailtrap.io",
// //   port: 2525,
// //   auth: {
// //     user: process.env.MAILTRAP_TEST_USER,
// //     pass: process.env.MAILTRAP_TEST_PASS,
// //   },
// // });

// // type Options = { to: string; name: string; link: string };
// // const sendVerificationMail = async (options: Options) => {
// //   if (process.env.NODE_ENV === "development") {
// //     await transport.sendMail({
// //       to: options.to,
// //       from: process.env.VERIFICATION_MAIL,
// //       subject: "Welcome Email",
// //       html: `<div>
// //               <p>Please click on <a href="${options.link}">this link</a></p>
// //           </div>`,
// //     });
// //   } else {
// //     const recipients = [
// //       {
// //         email: options.to,
// //       },
// //     ];

// //     client
// //       .send({
// //         from: sender,
// //         to: recipients,
// //         subject: "Welcome Email",
// //         html: `<div>
// //               <p>Please click on <a href="${options.link}">this link</a></p>
// //           </div>`,
// //         category: "Integration Test",
// //       })
// //       .then(console.log, console.error);
// //   }
// // };

// // const sendPassResetMail = async (options: Options) => {
// //   await transport.sendMail({
// //     to: options.to,
// //     from: process.env.VERIFICATION_MAIL,
// //     subject: "Update Password Request",
// //     html: `<div>
// //             <p>Please click on <a href="${options.link}">this link</a> to update your password.</p>
// //         </div>`,
// //   });
// // };

// // const mail = {
// //   sendVerificationMail,
// //   sendPassResetMail,
// // };

// // export default mail;

// // import nodemailer from "nodemailer";
// // import { MailtrapClient } from "mailtrap";

// // const TOKEN = process.env.MAILTRAP_TOKEN!;

// // const client = new MailtrapClient({ token: TOKEN });

// // const sender = {
// //   email: "no-reply@dessysattic.com",
// //   name: "DSY Team",
// // };

// // const transport = nodemailer.createTransport({
// //   host: "sandbox.smtp.mailtrap.io",
// //   port: 2525,
// //   auth: {
// //     user: process.env.MAILTRAP_TEST_USER,
// //     pass: process.env.MAILTRAP_TEST_PASS,
// //   },
// // });

// // type Options = { to: string; name: string; link: string };
// // const sendVerificationMail = async (options: Options) => {
// //   if (process.env.NODE_ENV === "development") {
// //     await transport.sendMail({
// //       to: options.to,
// //       from: process.env.VERIFICATION_MAIL,
// //       subject: "Welcome Email",
// //       html: `<div>
// //               <p>Please click on <a href="${options.link}">this link</a></p>
// //           </div>`,
// //     });
// //   } else {
// //     const recipients = [
// //       {
// //         email: options.to,
// //       },
// //     ];

// //     client
// //       .send({
// //         from: sender,
// //         to: recipients,
// //         subject: "Welcome Email",
// //         html: `<div>
// //               <p>Please click on <a href="${options.link}">this link</a></p>
// //           </div>`,
// //         category: "Integration Test",
// //       })
// //       .then(console.log, console.error);
// //   }
// // };

// // const sendPassResetMail = async (options: Options) => {
// //   await transport.sendMail({
// //     to: options.to,
// //     from: process.env.VERIFICATION_MAIL,
// //     subject: "Update Password Request",
// //     html: `<div>
// //             <p>Please click on <a href="${options.link}">this link</a> to update your password.</p>
// //         </div>`,
// //   });
// // };

// // const mail = {
// //   sendVerificationMail,
// //   sendPassResetMail,
// // };

// // export default mail;

// import nodemailer from "nodemailer";
// import jwt from "jsonwebtoken";

// const transport = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST || "defaultHost",
//   port: parseInt(process.env.EMAIL_PORT || "465"),
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER || "defaultUser",
//     pass: process.env.EMAIL_PASS || "defaultPass",
//   },
// });

// type Options = {
//   [x: string]: any;
//   to: string;
//   name: string;
//   link: string;
// };

// const generateToken = (email: string) => {
//   const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
//     expiresIn: "15m",
//   });
//   return token;
// };

// const sendVerificationMail = async (options: Options) => {
//   const verificationLink = `${
//     process.env.BASE_URL || "http://localhost:3000"
//   }/verify-email?token=${options.token}`;

//   await transport.sendMail({
//     to: options.to,
//     from: process.env.EMAIL_USER,
//     subject: "Welcome Email",
//     html: `<div>
//             <p>Please click on <a href="${verificationLink}">this link</a> to verify your email.</p>
//         </div>`,
//   });
// };

// // Send Password Reset Email
// const sendPassResetMail = async (options: Options) => {
//   const resetPasswordLink = `${
//     process.env.BASE_URL || "http://localhost:3000"
//   }/reset-password?token=${options.token}`;

//   await transport.sendMail({
//     to: options.to,
//     from: process.env.EMAIL_USER,
//     subject: "Password Reset Request",
//     html: `<div>
//             <p>Please click on <a href="${resetPasswordLink}">this link</a> to reset your password.</p>
//         </div>`,
//   });
// };

// const mail = {
//   sendVerificationMail,
//   sendPassResetMail,
// };

// export default mail;

import nodemailer from "nodemailer";
// Ensure you have the required environment variables set
const sender = {
  email: "no-reply@dessysattic.com",
  name: "DSY",
};

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_TEST_USER,
    pass: process.env.MAILTRAP_TEST_PASS,
  },
});

type Options = { to: string; name: string; link: string };

const sendVerificationMail = async (options: Options) => {
  const { to, link } = options;
  try {
    await transport.sendMail({
      to,
      from: sender.email,
      subject: "Welcome Email",
      html: `<div>
               <p>Please click on <a href="${link}">this link</a> to verify your email.</p>
             </div>`,
    });
    console.log("Verification email sent successfully!");
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }
};

// Function to send password reset email
const sendPassResetMail = async (options: Options) => {
  const { to, link } = options;
  try {
    await transport.sendMail({
      to,
      from: sender.email,
      subject: "Update Password Request",
      html: `<div>
               <p>Please click on <a href="${link}">this link</a> to update your password.</p>
             </div>`,
    });
    console.log("Password reset email sent successfully!");
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }
};

const mail = {
  sendVerificationMail,
  sendPassResetMail,
};

export default mail;
