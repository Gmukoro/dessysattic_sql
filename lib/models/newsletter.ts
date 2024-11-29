import { query } from "@/lib/database";

// Define the attributes for the Newsletter interface
interface NewsletterAttributes {
  email: string;
  date: Date;
}

// Add an email to the Newsletter list
export const addEmailToNewsletter = async (email: string) => {
  const insertQuery = `
    INSERT INTO newsletters (email, date)
    VALUES (?, NOW())
    ON DUPLICATE KEY UPDATE date = NOW()
  `;

  try {
    const result = await query({
      query: insertQuery,
      values: [email],
    });
    return result;
  } catch (error) {
    console.error("Error adding email to newsletter:", error);
    throw error;
  }
};

// Retrieve all emails in the newsletter list
export const getAllNewsletterEmails = async (): Promise<
  NewsletterAttributes[]
> => {
  const selectQuery = `SELECT * FROM newsletters`;

  try {
    const emails = await query({ query: selectQuery });

    // Type guard to ensure emails is an array of RowDataPacket
    if (Array.isArray(emails)) {
      return emails.map((email: any) => ({
        email: email.email,
        date: email.date,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching newsletter emails:", error);
    throw error;
  }
};

// Remove an email from the newsletter list
export const removeEmailFromNewsletter = async (email: string) => {
  const deleteQuery = `DELETE FROM newsletters WHERE email = ?`;

  try {
    const result = await query({ query: deleteQuery, values: [email] });
    return result;
  } catch (error) {
    console.error("Error removing email from newsletter:", error);
    throw error;
  }
};

export default {
  addEmailToNewsletter,
  getAllNewsletterEmails,
  removeEmailFromNewsletter,
};
