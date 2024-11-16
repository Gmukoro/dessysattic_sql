// lib\models\verificationToken.ts
import bcrypt from "bcryptjs";
import { query } from "@/lib/database"; // Import our custom query function

interface VerificationTokenAttributes {
  token: string;
  userId: string;
  expires: Date;
}

interface VerificationTokenResult {
  id: number;
  token: string;
  userId: string;
  expires: Date;
}

// Initialize the VerificationTokens table
export const initializeVerificationTokenTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS verification_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      token VARCHAR(255) NOT NULL,
      userId VARCHAR(255) NOT NULL,
      expires DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (userId)
    );
  `;

  try {
    await query({ query: createTableQuery });
    console.log("Verification Token table initialized successfully.");
  } catch (error) {
    console.error("Error initializing Verification Token table:", error);
  }
};

// Create a new verification token
export const createVerificationToken = async (
  data: VerificationTokenAttributes
) => {
  const hashedToken = bcrypt.hashSync(data.token, 10);
  const insertQuery = `
    INSERT INTO verification_tokens (token, userId, expires)
    VALUES (?, ?, ?)
  `;

  try {
    const result = await query({
      query: insertQuery,
      values: [hashedToken, data.userId, data.expires],
    });
    return result;
  } catch (error) {
    console.error("Error creating verification token:", error);
    throw error;
  }
};

// Find a token by user ID
export const getTokenByUserId = async (
  userId: string
): Promise<VerificationTokenResult | null> => {
  const selectQuery = `
    SELECT * FROM verification_tokens WHERE userId = ? LIMIT 1
  `;

  try {
    const rows = (await query({
      query: selectQuery,
      values: [userId],
    })) as VerificationTokenResult[];
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error retrieving token by user ID:", error);
    throw error;
  }
};

// Cleanup expired tokens
export const cleanupExpiredTokens = async () => {
  const deleteQuery = `
    DELETE FROM verification_tokens WHERE expires < NOW()
  `;

  try {
    await query({ query: deleteQuery });
    console.log("Expired tokens cleaned up.");
  } catch (error) {
    console.error("Error cleaning up expired tokens:", error);
    throw error;
  }
};

// Compare a provided token with the stored hash
export const compareToken = (
  storedToken: string,
  providedToken: string
): boolean => {
  return bcrypt.compareSync(providedToken, storedToken);
};

// Export all functions
export default {
  initializeVerificationTokenTable,
  createVerificationToken,
  getTokenByUserId,
  cleanupExpiredTokens,
  compareToken,
};
