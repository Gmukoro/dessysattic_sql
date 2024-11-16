import { query } from "@/lib/database";
import { RowDataPacket } from "mysql2/promise";

// Define the Collection interface
export interface CollectionAttributes {
  id: string;
  title: string;
  description?: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Initialize the Collection table if it doesn't exist
export const initializeCollection = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS collections (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,               -- Auto-increment ID for collection
      title VARCHAR(255) NOT NULL UNIQUE,                        -- Title must be unique
      description TEXT,                                          -- Optional description
      image VARCHAR(255) NOT NULL,                               -- Image URL
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,              -- Timestamp for creation
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Auto update on modification
      FOREIGN KEY (id) REFERENCES products(collection_id)      -- Foreign key relationship to the products table
    );
  `;
  try {
    await query({ query: createTableQuery });
    console.log("Collection table initialized successfully.");
  } catch (error) {
    console.error("Error initializing the Collection table:", error);
  }
};

// Create a new collection
export const createCollection = async (
  collectionData: Omit<CollectionAttributes, "createdAt" | "updatedAt">
) => {
  const { title, description, image } = collectionData;
  const insertQuery = `
    INSERT INTO collections (title, description, image, createdAt, updatedAt)
    VALUES (?, ?, ?, NOW(), NOW())
  `;
  try {
    const result = await query({
      query: insertQuery,
      values: [title, description, image],
    });
    return result;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
};

// Fetch all collections
export const getAllCollections = async (): Promise<CollectionAttributes[]> => {
  const selectQuery = `
    SELECT * FROM collections ORDER BY createdAt DESC
  `;
  try {
    const collections = await query({ query: selectQuery });
    return collections as CollectionAttributes[];
  } catch (error) {
    console.error("Error fetching collections:", error);
    throw error;
  }
};

// Fetch a collection by ID
export const getCollectionById = async (id: string) => {
  const sql = `SELECT * FROM collections WHERE id = ?`;

  try {
    // Explicitly type the result as RowDataPacket[]
    const rows = (await query({ query: sql, values: [id] })) as RowDataPacket[];

    if (rows.length > 0) {
      const collection = rows[0] as any;
      return {
        _id: collection.id,
        title: collection.title,
        image: collection.image,
        products: JSON.parse(collection.products),
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching collection by ID:", error);
    throw error;
  }
};

// Update a collection
export const updateCollection = async (
  collectionId: string,
  updatedData: Partial<CollectionAttributes>
) => {
  const { title, description, image } = updatedData;
  const updateQuery = `
    UPDATE collections
    SET title = COALESCE(?, title),
        description = COALESCE(?, description),
        image = COALESCE(?, image),
        updatedAt = NOW()
    WHERE id = ?
  `;
  try {
    const result = await query({
      query: updateQuery,
      values: [title, description, image, collectionId],
    });
    return result;
  } catch (error) {
    console.error("Error updating collection:", error);
    throw error;
  }
};

// Delete a collection by ID
export const deleteCollection = async (collectionId: string) => {
  const deleteQuery = `DELETE FROM collections WHERE id = ?`;
  try {
    const result = await query({ query: deleteQuery, values: [collectionId] });
    return result;
  } catch (error) {
    console.error("Error deleting collection:", error);
    throw error;
  }
};

export default {
  initializeCollection,
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
};
