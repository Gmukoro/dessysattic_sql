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
  compareToken: (token: string) => boolean;
}

interface Methods {
  compareToken(token: string): boolean;
}

// Create a new verification token
// Create a new verification token with dynamic expiry
export const createVerificationToken = async (
  data: VerificationTokenAttributes
) => {
  const hashedToken = bcrypt.hashSync(data.token, 10);
  const insertQuery = `
    INSERT INTO verification_tokens (token, userId, expires)
    VALUES (?, ?, ?)
  `;

  try {
    // Add a dynamic expiration logic if needed, e.g., 1 hour expiry:
    const expirationTime = new Date();
    expirationTime.setHours(expirationTime.getHours() + 1);

    const result = await query({
      query: insertQuery,
      values: [hashedToken, data.userId, expirationTime],
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

    if (rows.length > 0) {
      const token = rows[0];
      // Attach the compareToken method
      token.compareToken = (providedToken: string) => {
        return bcrypt.compareSync(providedToken, token.token);
      };
      return token;
    }

    return null;
  } catch (error) {
    console.error("Error retrieving token by user ID:", error);
    throw error;
  }
};

// Cleanup expired tokens
export const cleanupExpiredTokens = async (id: number) => {
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
  createVerificationToken,
  getTokenByUserId,
  cleanupExpiredTokens,
  compareToken,
};
