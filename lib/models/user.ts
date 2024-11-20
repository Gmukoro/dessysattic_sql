//lib\models\user.ts

import { query } from "@/lib/database";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { RowDataPacket } from "mysql2";

type UserRow = UserAttributes & RowDataPacket;

//wishlist functions
interface UserData extends RowDataPacket {
  wishlist: string[];
}

// Define the interface for user attributes
export interface UserAttributes {
  id?: string;
  name: string;
  email: string;
  password?: string;
  avatar?: { id?: string; url: string };
  verified: boolean;
  provider: "credentials";
  wishlist?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the return type for query result
type UserResult = UserAttributes[];

// Initialize the User table if it doesn't exist
export const initializeUser = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NULL,
        avatar JSON NULL,
        verified BOOLEAN DEFAULT false,
        wishlist JSON DEFAULT '[]',
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await query({ query: createTableQuery });
    console.log("User table initialized successfully.");
  } catch (error) {
    console.error("Error initializing the User table:", error);
  }
};

// Password hashing
export const hashPassword = (password: string): string => {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
};

// Verify password
export const comparePasswords = (
  plainTextPassword: string,
  hashedPassword: string
): boolean => {
  return compareSync(plainTextPassword, hashedPassword);
};

// Format user data to maintain consistent structure
const formatUser = (user: any): UserAttributes => ({
  ...user,
  avatar: (() => {
    try {
      return JSON.parse(user.avatar || "{}");
    } catch {
      return {};
    }
  })(),
  wishlist: (() => {
    try {
      return JSON.parse(user.wishlist || "[]");
    } catch {
      return [];
    }
  })(),
});

// Create a new user

export const createUser = async ({
  name,
  email,
  password,
  provider,
  verified,
}: {
  name: string;
  email: string;
  password: string;
  provider: string;
  verified: boolean;
}) => {
  const sqlQuery = `
    INSERT INTO users (name, email, password, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?)
  `;

  const values = [name, email, password, new Date(), new Date()];

  try {
    // Execute the query using the query function from lib/db.ts
    const result = await query({
      query: sqlQuery,
      values: values,
    });

    // Check for the insertId in the result and return the ID of the newly created user
    if ("insertId" in result) {
      return { id: result.insertId };
    } else {
      throw new Error("Failed to retrieve the insertId for the new user.");
    }
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Error creating user.");
  }
};

export const getUserByEmail = async (
  email: string
): Promise<UserAttributes | null> => {
  const selectQuery = `SELECT * FROM users WHERE email = ?`;
  try {
    const users = (await query({
      query: selectQuery,
      values: [email.trim()],
    })) as UserResult;
    return users.length > 0 ? formatUser(users[0]) : null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Error fetching user by email.");
  }
};

// Fetch a user by ID
export const getUserById = async (
  id: string
): Promise<UserAttributes | null> => {
  const selectQuery = `SELECT * FROM users WHERE id = ?`;
  try {
    const users = (await query({
      query: selectQuery,
      values: [id],
    })) as UserResult;
    return users.length > 0 ? formatUser(users[0]) : null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw new Error("Error fetching user by ID.");
  }
};

// Update user attributes
export const updateUser = async (
  id: string,
  updatedData: Partial<UserAttributes>
) => {
  const { name, email, password, avatar, verified, wishlist } = updatedData;
  const updateQuery = `
    UPDATE users
    SET name = COALESCE(?, name),
        email = COALESCE(?, email),
        password = COALESCE(?, password),
        avatar = COALESCE(?, avatar),
        verified = COALESCE(?, verified),
        wishlist = COALESCE(?, wishlist),
        updatedAt = NOW()
    WHERE id = ?
  `;

  try {
    const hashedPassword = password ? hashPassword(password) : undefined;
    const result = await query({
      query: updateQuery,
      values: [
        name?.trim(),
        email?.trim(),
        hashedPassword,
        JSON.stringify(avatar),
        verified,
        JSON.stringify(wishlist),
        id,
      ],
    });
    return result;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Add product to wishlist
export const addToWishlist = async (userId: string, productId: string) => {
  const selectQuery = `SELECT wishlist FROM users WHERE id = ?`;

  const result = (await query({
    query: selectQuery,
    values: [userId],
  })) as UserResult;

  if (result.length === 0) {
    throw new Error("User not found");
  }

  const user = result[0];
  const wishlist = user?.wishlist ?? [];

  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
  }

  const updateQuery = `UPDATE users SET wishlist = ? WHERE id = ?`;
  await query({
    query: updateQuery,
    values: [JSON.stringify(wishlist), userId],
  });

  return wishlist;
};

// Remove product from wishlist
export const removeFromWishlist = async (userId: string, productId: string) => {
  const selectQuery = `SELECT wishlist FROM users WHERE id = ?`;

  const result = (await query({
    query: selectQuery,
    values: [userId],
  })) as UserResult;

  if (result.length === 0) {
    throw new Error("User not found");
  }

  const user = result[0];
  const wishlist = user?.wishlist ?? [];

  const updatedWishlist = wishlist.filter((id: string) => id !== productId);

  const updateQuery = `UPDATE users SET wishlist = ? WHERE id = ?`;
  await query({
    query: updateQuery,
    values: [JSON.stringify(updatedWishlist), userId],
  });

  return updatedWishlist;
};

// Compare a user's password
export const compareUserPassword = async (
  userEmail: string,
  password: string
): Promise<boolean> => {
  const user = await getUserByEmail(userEmail);
  if (!user || !user.password) return false;
  return comparePasswords(password, user.password);
};
