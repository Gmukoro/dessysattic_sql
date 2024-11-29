// lib/models/passwordResetToken.ts

import bcrypt from "bcryptjs";
import { query } from "@/lib/database";
import cron from "node-cron"; // Import node-cron for scheduling tasks

interface PasswordResetTokenAttributes {
  token: string;
  userId: string;
  expires: Date;
}

// Create a password reset token
export const createPasswordResetToken = async (
  data: PasswordResetTokenAttributes
) => {
  const hashedToken = bcrypt.hashSync(data.token, 10);
  const insertQuery = `
    INSERT INTO password_reset_tokens (token, userId, expires)
    VALUES (?, ?, ?)
  `;
  try {
    const result = await query({
      query: insertQuery,
      values: [hashedToken, data.userId, data.expires],
    });
    return result;
  } catch (error) {
    console.error("Error creating password reset token:", error);
    throw error;
  }
};

// Compare a provided token with the stored hashed token
export const comparePasswordResetToken = async (
  token: string,
  userId: string
): Promise<{ id: string; token: string } | null> => {
  const selectQuery = `SELECT id, token FROM password_reset_tokens WHERE userId = ? ORDER BY createdAt DESC LIMIT 1`;
  try {
    const rows = await query({ query: selectQuery, values: [userId] });

    if (Array.isArray(rows) && rows.length > 0) {
      const row = rows[0] as { id: string; token: string };
      const isValid = bcrypt.compareSync(token, row.token);
      return isValid ? row : null;
    }
    return null;
  } catch (error) {
    console.error("Error comparing password reset token:", error);
    throw error;
  }
};

// Delete expired tokens
export const deleteExpiredTokens = async () => {
  const deleteQuery = `DELETE FROM password_reset_tokens WHERE expires < NOW()`;
  try {
    const result = await query({ query: deleteQuery });

    // Type guard to ensure the result is of the correct type (OkPacket)
    if ("affectedRows" in result) {
      console.log(`Expired tokens deleted: ${result.affectedRows}`);
    }
    return result;
  } catch (error) {
    console.error("Error deleting expired tokens:", error);
    throw error;
  }
};

// Delete password reset token by user ID
export const deleteByUserId = async (userId: string) => {
  const deleteQuery = `DELETE FROM password_reset_tokens WHERE userId = ?`;
  try {
    const result = await query({ query: deleteQuery, values: [userId] });

    // Type guard to ensure the result is of the correct type (OkPacket)
    if ("affectedRows" in result) {
      console.log(`Password reset token deleted for user: ${userId}`);
    }
    return result;
  } catch (error) {
    console.error("Error deleting password reset token:", error);
    throw error;
  }
};

export const findOne = async (userId: string) => {
  const selectQuery = `SELECT id, token FROM password_reset_tokens WHERE userId = ? ORDER BY createdAt DESC LIMIT 1`;
  try {
    const rows = await query({ query: selectQuery, values: [userId] });

    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0]; // Return the first token found
    }
    return null; // Return null if no token is found
  } catch (error) {
    console.error("Error fetching password reset token:", error);
    throw error;
  }
};

// Automatically delete expired tokens every hour
cron.schedule("0 * * * *", () => {
  console.log("Checking for expired tokens...");
  deleteExpiredTokens()
    .then(() => console.log("Expired tokens cleaned up."))
    .catch((error) => console.error("Error cleaning expired tokens:", error));
});

// Export all functions
export default {
  createPasswordResetToken,
  comparePasswordResetToken,
  deleteExpiredTokens,
  deleteByUserId,
  findOne,
};
