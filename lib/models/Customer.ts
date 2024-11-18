//lib\models\Customer.ts

import { query } from "@/lib/database";

export interface CustomerAttributes {
  id: string;
  userId: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

// Initialize the Customer table if it doesn't exist
export const initializeCustomer = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS customers (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `;
    await query({ query: createTableQuery });
    console.log("Customer table initialized successfully.");
  } catch (error) {
    console.error("Error initializing the Customer table:", error);
  }
};

// CRUD operations for the Customer model

// Create a new customer
export const createCustomer = async (
  customerData: Omit<CustomerAttributes, "id">
) => {
  const { userId, name, email } = customerData;
  const insertQuery = `
    INSERT INTO customers (id, userId, name, email, createdAt, updatedAt)
    VALUES (UUID(), ?, ?, ?, NOW(), NOW())
  `;
  try {
    const result = await query({
      query: insertQuery,
      values: [userId, name, email],
    });
    return result;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

// Fetch a customer by ID
export const getCustomerById = async (id: string) => {
  const selectQuery = `SELECT * FROM customers WHERE id = ?`;
  try {
    const result = await query({ query: selectQuery, values: [id] });

    // Type guard to check if result is an array and has at least one item
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as CustomerAttributes;
    }

    // Return null or throw an error if no customer is found
    return null;
  } catch (error) {
    console.error("Error fetching customer by ID:", error);
    throw error;
  }
};

// Update a customer
export const updateCustomer = async (
  id: string,
  updatedData: Partial<CustomerAttributes>
) => {
  const { name, email } = updatedData;
  const updateQuery = `
    UPDATE customers
    SET name = COALESCE(?, name),
        email = COALESCE(?, email),
        updatedAt = NOW()
    WHERE id = ?
  `;
  try {
    const result = await query({
      query: updateQuery,
      values: [name, email, id],
    });
    return result;
  } catch (error) {
    console.error("Error updating customer:", error);
    throw error;
  }
};

// Delete a customer
export const deleteCustomer = async (id: string) => {
  const deleteQuery = `DELETE FROM customers WHERE id = ?`;
  try {
    const result = await query({ query: deleteQuery, values: [id] });
    return result;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
};
