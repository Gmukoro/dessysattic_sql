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
interface UserAttributes {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for non-credentials providers
  avatar?: { id?: string; url: string };
  verified: boolean;
  wishlist: string[];
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
  avatar: JSON.parse(user.avatar || "{}"),
  wishlist: JSON.parse(user.wishlist || "[]"),
});

// Create a new user
export const createUser = async (userData: Omit<UserAttributes, "id">) => {
  const { name, email, password, verified, wishlist, avatar } = userData;
  const insertQuery = `
    INSERT INTO users (id, name, email, password, verified, wishlist, avatar, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  try {
    const hashedPassword = password ? hashPassword(password) : null;
    const result = await query({
      query: insertQuery,
      values: [
        uuidv4(),
        name.trim(),
        email.trim(),
        hashedPassword,
        verified,
        JSON.stringify(wishlist),
        JSON.stringify(avatar),
      ],
    });
    return result;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

// Fetch a user by email
export const getUserByEmail = async (
  email: string
): Promise<UserAttributes | null> => {
  const selectQuery = `SELECT * FROM users WHERE email = ?`;
  try {
    const users = (await query({
      query: selectQuery,
      values: [email.trim()],
    })) as UserRow[];
    return users.length > 0 ? formatUser(users[0]) : null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
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
    throw error;
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

export const addToWishlist = async (userId: string, productId: string) => {
  const selectQuery = `SELECT wishlist FROM users WHERE id = ?`;

  // Ensure the result is typed as an array of UserData
  const result = (await query({
    query: selectQuery,
    values: [userId],
  })) as UserData[];

  // If no user is found, return an empty array or handle accordingly
  if (result.length === 0) {
    throw new Error("User not found");
  }

  const user = result[0];

  // Default to an empty array if undefined
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

export const removeFromWishlist = async (userId: string, productId: string) => {
  const selectQuery = `SELECT wishlist FROM users WHERE id = ?`;

  // Ensure the result is typed as an array of UserData
  const result = (await query({
    query: selectQuery,
    values: [userId],
  })) as UserData[];

  // If no user is found, return an empty array or handle accordingly
  if (result.length === 0) {
    throw new Error("User not found");
  }

  const user = result[0];

  // Default to an empty array if undefined
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
