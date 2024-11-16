// lib/models/reviews.ts

import { query } from "@/lib/database";

// Define the ReviewAttributes interface
interface ReviewAttributes {
  id?: number;
  _id: string;
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
      _id VARCHAR(255) NOT NULL UNIQUE,
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
  }
};

// Create a new review
export const createReview = async (data: ReviewAttributes) => {
  const insertQuery = `
    INSERT INTO reviews (_id, name, content, rating, email, productId, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;
  try {
    const result = await query({
      query: insertQuery,
      values: [
        data._id,
        data.name,
        data.content,
        data.rating,
        data.email,
        data.productId,
      ],
    });
    return result;
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
};

// Retrieve all reviews for a specific product
export const getReviewsByProductId = async (productId: string) => {
  const selectQuery = `
    SELECT * FROM reviews WHERE productId = ?
  `;
  try {
    const rows = await query({ query: selectQuery, values: [productId] });
    return rows;
  } catch (error) {
    console.error("Error retrieving reviews:", error);
    throw error;
  }
};

// Retrieve all reviews
export const getAllReviews = async () => {
  const selectAllQuery = `
    SELECT * FROM reviews
  `;
  try {
    const rows = await query({ query: selectAllQuery });
    return rows as ReviewAttributes[];
  } catch (error) {
    console.error("Error retrieving all reviews:", error);
    throw error;
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
    console.error("Error updating review:", error);
    throw error;
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
    console.error("Error deleting review:", error);
    throw error;
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
};
