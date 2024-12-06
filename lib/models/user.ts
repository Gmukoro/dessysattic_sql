//lib\models\user.ts

import { query } from "@/lib/database";
import bcrypt, { compareSync } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { ResultSetHeader, RowDataPacket } from "mysql2";

type UserRow = UserAttributes & RowDataPacket;

//wishlist functions
interface UserData extends RowDataPacket {
  wishlist: string[];
}

// Define the interface for user attributes
export interface UserAttributes {
  verified: any;
  id?: number;
  name: string;
  email: string;
  password?: string;
  avatar?: { id?: string; url: string };
  provider: "credentials";
  wishlist?: string[];
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the return type for query result
type UserResult = UserAttributes[];

// Password hashing
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Verify password
const comparePasswords = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
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
  wishlist: Array.isArray(user.wishlist)
    ? user.wishlist
    : JSON.parse(user.wishlist || "[]"),
  role: typeof user.role === "string" ? user.role : "",
});

export const updateWishlist = async (
  userId: number,
  newWishlistItem: string
) => {
  const user = await getUserById(userId);

  if (user) {
    // Ensure wishlist is an array (default to empty array if undefined)
    const updatedWishlist = [...(user.wishlist || []), newWishlistItem];

    // Save the updated wishlist back to the database
    const updateQuery = `UPDATE users SET wishlist = ? WHERE id = ?`;
    try {
      await query({
        query: updateQuery,
        values: [JSON.stringify(updatedWishlist), userId.toString()],
      });
      console.log("Wishlist updated successfully!");
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  } else {
    console.error("User not found");
  }
};

// Create a new user

// Create a new user
export const createUser = async (
  data: Omit<UserAttributes, "id" | "createdAt" | "updatedAt">
): Promise<{
  id: number;
  name: string;
  email: string;
}> => {
  const {
    name,
    email,
    password,
    provider = "credentials",
    verified,
    role = "user",
    wishlist,
  } = data;

  const sqlQuery = `
    INSERT INTO users (name, email, password, provider, verified, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  try {
    const result = (await query({
      query: sqlQuery,
      values: [
        name ?? "",
        email ?? "",
        password ?? "",
        provider,
        verified ?? false,
        role,
      ],
    })) as ResultSetHeader;

    // Save wishlist if it's not empty
    if (wishlist) {
      await updateWishlist(result.insertId, wishlist[0]);
    }

    return { id: result.insertId, name, email };
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user.");
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

    // Check that the result is a valid array
    if (Array.isArray(users) && users.length > 0) {
      return formatUser(users[0]);
    }
    return null;
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

// Fetch a user by ID
export const getUserById = async (
  id: number
): Promise<UserAttributes | null> => {
  const selectQuery = `SELECT * FROM users WHERE id = ?`;

  try {
    const users = (await query({
      query: selectQuery,
      values: [id],
    })) as UserResult;

    // Ensure result is valid
    if (Array.isArray(users) && users.length > 0) {
      return formatUser(users[0]);
    }
    return null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};

// Update user attributes
export const updateUser = async (
  id: number,
  updatedData: Partial<UserAttributes>
) => {
  const updateFields = [];
  const updateValues = [];

  if (updatedData.name) {
    updateFields.push("name = ?");
    updateValues.push(updatedData.name.trim());
  }

  if (updatedData.email) {
    updateFields.push("email = ?");
    updateValues.push(updatedData.email.trim());
  }

  if (updatedData.password) {
    updateFields.push("password = ?");
    updateValues.push(await hashPassword(updatedData.password));
  }

  if (updatedData.avatar) {
    updateFields.push("avatar = ?");
    updateValues.push(JSON.stringify(updatedData.avatar));
  }

  if (updatedData.verified !== undefined) {
    updateFields.push("verified = ?");
    updateValues.push(updatedData.verified);
  }

  if (updatedData.wishlist) {
    updateFields.push("wishlist = ?");
    updateValues.push(JSON.stringify(updatedData.wishlist));
  }

  if (updatedData.role) {
    updateFields.push("role = ?");
    updateValues.push(updatedData.role);
  }

  updateFields.push("updatedAt = NOW()");
  updateValues.push(id);

  const updateQuery = `UPDATE users SET ${updateFields.join(
    ", "
  )} WHERE id = ?`;

  try {
    await query({
      query: updateQuery,
      values: updateValues,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

// Add product to wishlist
export const addToWishlist = async (
  userId: number,
  updatedWishlist: string[]
): Promise<UserAttributes> => {
  if (!Array.isArray(updatedWishlist)) {
    throw new Error("Invalid wishlist format. Expected an array.");
  }

  try {
    const sqlQuery = `UPDATE users SET wishlist = ? WHERE id = ?`;
    await query({
      query: sqlQuery,
      values: [JSON.stringify(updatedWishlist), userId],
    });

    const updatedUser = await getUserById(userId);
    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    console.error("Error saving wishlist to database:", error);
    throw new Error("Failed to update wishlist");
  }
};

// Remove product from wishlist
export const removeFromWishlist = async (
  userId: number,
  productId: string
): Promise<string[]> => {
  try {
    const selectQuery = `SELECT wishlist FROM users WHERE id = ?`;
    const result = (await query({
      query: selectQuery,
      values: [userId],
    })) as UserResult;

    if (result.length === 0) {
      throw new Error("User not found");
    }

    const user = result[0];
    const wishlist = Array.isArray(user.wishlist)
      ? user.wishlist
      : JSON.parse(user.wishlist || "[]");

    const updatedWishlist = wishlist.filter((id: string) => id !== productId);

    const updateQuery = `UPDATE users SET wishlist = ? WHERE id = ?`;
    await query({
      query: updateQuery,
      values: [JSON.stringify(updatedWishlist), userId],
    });

    return updatedWishlist;
  } catch (error) {
    console.error("Error updating wishlist:", error);
    throw new Error("Unable to update wishlist.");
  }
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

//get admin emails
export const getAdminEmails = async (email: string): Promise<string[]> => {
  const selectQuery = `SELECT email FROM admin_email`;

  try {
    const result = (await query({ query: selectQuery })) as RowDataPacket[];

    // Extract emails from result
    return result.map((row) => row.email);
  } catch (error) {
    console.error("Error fetching admin emails:", error);
    throw new Error("Unable to fetch admin emails.");
  }
};
