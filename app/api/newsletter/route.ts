import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { query } from "@/lib/database";

// Define the attributes for the Newsletter interface
interface NewsletterAttributes {
  email: string;
  date: Date;
}

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

// POST - Add email to the newsletter
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { email } = data;

    // Insert new email into the newsletter list in MySQL
    const insertQuery = `
      INSERT INTO newsletters (email, date)
      VALUES (?, NOW())
      ON DUPLICATE KEY UPDATE date = NOW()
    `;
    await query({ query: insertQuery, values: [email] });

    // Notify admin of the new subscription
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: "dessysattic@gmail.com",
      subject: "New Newsletter Signup",
      text: `You have a new subscriber: ${email}`,
    };
    await transporter.sendMail(adminMailOptions);

    // Send confirmation to the subscriber
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Signing Up",
      text: `Hello,\n\nThank you for signing up for the newsletter!\n\nStay tuned for our special offers and updates.\n\nBest regards,\nDSY Team\nhttps://dessysattic.com`,
    };
    await transporter.sendMail(customerMailOptions);

    return NextResponse.json({
      msg: "Successfully subscribed to the newsletter!",
      success: true,
    });
  } catch (error) {
    console.error("Error during newsletter signup:", error);

    // Handle duplicate email entry error
    if ((error as any).code === "ER_DUP_ENTRY") {
      return NextResponse.json({
        msg: "This email is already subscribed to the newsletter.",
        success: false,
      });
    }

    return NextResponse.json({
      msg: "Unable to process the subscription request.",
      success: false,
    });
  }
}

// DELETE - Remove email from the newsletter
export async function DELETE(request: Request) {
  try {
    const data = await request.json();
    const { email } = data;

    // Remove the email from the newsletter list in MySQL
    const deleteQuery = `DELETE FROM newsletters WHERE email = ?`;
    await query({ query: deleteQuery, values: [email] });

    return NextResponse.json({
      msg: "Successfully unsubscribed from the newsletter.",
      success: true,
    });
  } catch (error) {
    console.error("Error unsubscribing from the newsletter:", error);

    return NextResponse.json({
      msg: "Unable to process the unsubscription request.",
      success: false,
    });
  }
}

// GET - Retrieve all subscribed emails
export async function GET() {
  try {
    const selectQuery = `SELECT * FROM newsletters`;
    const emails = await query({ query: selectQuery });

    // Type guard to ensure emails is an array of RowDataPacket
    const formattedEmails = Array.isArray(emails)
      ? emails.map((email: any) => ({
          email: email.email,
          date: email.date,
        }))
      : [];

    return NextResponse.json({
      emails: formattedEmails,
      success: true,
    });
  } catch (error) {
    console.error("Error retrieving newsletter emails:", error);

    return NextResponse.json({
      msg: "Unable to retrieve the list of subscribers.",
      success: false,
    });
  }
}
