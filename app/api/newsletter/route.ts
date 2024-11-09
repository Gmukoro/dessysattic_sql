//app\api\newsletter\route.ts

import Newsletter from "@/lib/models/newsletter";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { ValidationError } from "sequelize";

// Configure nodemailer for Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email } = data;

    // Insert new newsletter subscription using Sequelize model for MySQL
    const contactMessage = await Newsletter.create({ email });

    // Email to admin about the new subscription
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "dessysattic@gmail.com",
      subject: "New Newsletter Signup",
      text: `You have a new subscriber: ${email}`,
    };
    await transporter.sendMail(mailOptions);

    // Confirmation email to the user
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Signing Up",
      text: `Hello,\n\nThank you for signing up for the newsletter!\n\nStay tuned for our special offers and updates.\n\nBest regards,\nDSY Team\nhttps://dessysattic.com`,
    };
    await transporter.sendMail(customerMailOptions);

    return NextResponse.json({
      msg: ["Message sent successfully"],
      success: true,
    });
  } catch (error: unknown) {
    console.error("Error during newsletter signup:", error);

    // Handle unique constraint error (e.g., duplicate email)
    if ((error as any).code === "ER_DUP_ENTRY") {
      return NextResponse.json({
        msg: "This email is already subscribed to the newsletter.",
        success: false,
      });
    }

    // Check if the error is a SequelizeValidationError
    if (error instanceof ValidationError) {
      let errorList = [];
      // Access the validation errors if it's a SequelizeValidationError
      for (let e of error.errors) {
        console.log(e.message);
        errorList.push(e.message);
      }
      console.log("Validation Errors:", errorList);
      return NextResponse.json({ msg: errorList, success: false });
    } else {
      return NextResponse.json({
        msg: "Unable to send message",
        success: false,
      });
    }
  }
}
