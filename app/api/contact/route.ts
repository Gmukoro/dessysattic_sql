import { query } from "@/lib/database";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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
    const { name, email, message } = data;

    // Insert contact message into MySQL using raw query
    const insertQuery = `
      INSERT INTO contacts (name, email, message, date) 
      VALUES (?, ?, ?, NOW())
    `;
    await query({ query: insertQuery, values: [name, email, message] });

    // Email to admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "dessysattic@gmail.com",
      subject: "New Contact Form Submission",
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
    };
    await transporter.sendMail(mailOptions);

    // Confirmation email to the user
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Contacting Us",
      text: `Dear ${name},\n\nThank you for reaching out to us! We have received your message:\n\n${message}\n\nWe will get back to you shortly.\n\nBest regards,\nDSY Team`,
    };
    await transporter.sendMail(customerMailOptions);

    return NextResponse.json({
      msg: ["Message sent successfully"],
      success: true,
    });
  } catch (error: unknown) {
    console.error("Error during contact form submission:", error);

    if (error instanceof Error && error.name === "SequelizeValidationError") {
      // Type assertion for SequelizeValidationError
      const validationError = error as any;

      // Collect Sequelize validation errors
      const errorList = validationError.errors.map((err: any) => err.message);
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
