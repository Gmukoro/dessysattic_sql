import { query } from "@/lib/database";
import { RowDataPacket } from "mysql2";

// Define the ReviewAttributes interface
interface ReviewAttributes {
  id?: number;
  name: string;
  content: string;
  rating: number;
  email: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Initialize the Reviews table
export const initializeReviewTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
      email VARCHAR(255) NOT NULL,
      productId VARCHAR(255) NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE (email, productId)  -- Unique constraint on email and productId combination
    );
  `;
  try {
    await query({ query: createTableQuery });
    console.log("Review table initialized successfully.");
  } catch (error) {
    console.error("Error initializing Review table:", error);
    throw new Error("Error initializing Review table.");
  }
};

// Create a new review
export const createReview = async (data: ReviewAttributes) => {
  const checkUniqueQuery = `
    SELECT * FROM reviews WHERE email = ? AND productId = ?
  `;

  const insertQuery = `
    INSERT INTO reviews (name, content, rating, email, productId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, NOW(), NOW())
  `;

  try {
    // Ensure the query result is an array of rows
    const existingReview = (await query({
      query: checkUniqueQuery,
      values: [data.email, data.productId],
    })) as RowDataPacket[];

    // Check if the review already exists
    if (existingReview.length > 0) {
      throw new Error(
        "A review for this product by this email already exists."
      );
    }

    // Insert the new review
    const result = await query({
      query: insertQuery,
      values: [
        data.name,
        data.content,
        data.rating,
        data.email,
        data.productId,
      ],
    });

    return result;
  } catch (error) {
    console.error(
      `Error creating review for productId: ${data.productId}`,
      error
    );
    throw new Error(`Error creating review for productId: ${data.productId}`);
  }
};

// Retrieve all reviews for a specific product
export const getReviewsByProductId = async (productId: string) => {
  const selectQuery = `
    SELECT * FROM reviews WHERE productId = ? ORDER BY createdAt DESC
  `;
  try {
    const rows = await query({ query: selectQuery, values: [productId] });
    return rows as ReviewAttributes[];
  } catch (error) {
    console.error(
      `Error retrieving reviews for productId: ${productId}`,
      error
    );
    throw new Error(`Error retrieving reviews for productId: ${productId}`);
  }
};

// Fetch all reviews by an email address
export const getReviewsByEmail = async (email: string) => {
  const selectQuery = `
    SELECT * FROM reviews WHERE email = ? ORDER BY createdAt DESC
  `;
  try {
    const rows = await query({ query: selectQuery, values: [email] });
    return rows as ReviewAttributes[];
  } catch (error) {
    console.error(`Error retrieving reviews for email: ${email}`, error);
    throw new Error(`Error retrieving reviews for email: ${email}`);
  }
};

// Retrieve all reviews
export const getAllReviews = async () => {
  const selectAllQuery = `
    SELECT * FROM reviews ORDER BY createdAt DESC
  `;
  try {
    const rows = await query({ query: selectAllQuery });
    return rows as ReviewAttributes[];
  } catch (error) {
    console.error("Error retrieving all reviews:", error);
    throw new Error("Error retrieving all reviews.");
  }
};

// Update a review by ID
export const updateReview = async (
  id: number,
  data: Partial<ReviewAttributes>
) => {
  const updateQuery = `
    UPDATE reviews SET name = ?, content = ?, rating = ?, email = ?, updatedAt = NOW()
    WHERE id = ?
  `;
  try {
    const result = await query({
      query: updateQuery,
      values: [data.name, data.content, data.rating, data.email, id],
    });
    return result;
  } catch (error) {
    console.error(`Error updating review with id: ${id}`, error);
    throw new Error(`Error updating review with id: ${id}`);
  }
};

// Delete a review by ID
export const deleteReview = async (id: number) => {
  const deleteQuery = `
    DELETE FROM reviews WHERE id = ?
  `;
  try {
    const result = await query({ query: deleteQuery, values: [id] });
    return result;
  } catch (error) {
    console.error(`Error deleting review with id: ${id}`, error);
    throw new Error(`Error deleting review with id: ${id}`);
  }
};

// Export all functions
export default {
  initializeReviewTable,
  createReview,
  getReviewsByProductId,
  getAllReviews,
  updateReview,
  deleteReview,
  getReviewsByEmail,
};
