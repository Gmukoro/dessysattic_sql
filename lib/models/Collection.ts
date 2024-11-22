import { query } from "@/lib/database";
import { OkPacket, RowDataPacket } from "mysql2/promise";
import { getProductIdsByCriteria, ProductAttributes } from "./Product";

// Define the Collection interface
export interface CollectionAttributes {
  id: string;
  title: string;
  description: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the PRODUCTS_TABLE constant
const PRODUCTS_TABLE = "products";

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
  collectionData: Omit<CollectionAttributes, "createdAt" | "updatedAt" | "id">
) => {
  const { title, description, image } = collectionData;

  const insertQuery = `
    INSERT INTO collections (title, description, image, createdAt, updatedAt)
    VALUES (?, ?, ?, NOW(), NOW())
  `;
  try {
    const result = await query({
      query: insertQuery,
      values: [title, description ?? null, image ?? null],
    });
    return result;
  } catch (error) {
    console.error("Error creating collection:", error);
    throw error;
  }
};

export const createCollectionWithProducts = async (
  collectionData: Omit<CollectionAttributes, "createdAt" | "updatedAt">,
  productCriteria: Partial<ProductAttributes>
) => {
  try {
    // Step 1: Create the collection
    const { title, description, image } = collectionData;
    const insertCollectionQuery = `
      INSERT INTO collections (title, description, image, createdAt, updatedAt)
      VALUES (?, ?, ?, NOW(), NOW())
    `;
    const collectionResult = await query({
      query: insertCollectionQuery,
      values: [title, description, image],
    });

    // Cast the collectionResult to OkPacket to access insertId
    const collectionResultPacket = collectionResult as OkPacket;
    const collectionId = collectionResultPacket.insertId;

    // Step 2: Fetch product IDs based on criteria
    const productIds = await getProductIdsByCriteria(productCriteria);

    // Step 3: Insert product-collection relationships
    const insertProductCollectionQuery = `
      INSERT INTO collection_products (productId, collectionId)
      VALUES (?, ?)
    `;
    for (const productId of productIds) {
      await query({
        query: insertProductCollectionQuery,
        values: [productId, collectionId],
      });
    }

    return { collectionId, productIds };
  } catch (error) {
    console.error("Error creating collection with products:", error);
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
export const getCollectionById = async (
  id: number
): Promise<CollectionAttributes | null> => {
  const selectQuery = `SELECT * FROM collections WHERE id = ?`;
  try {
    const rows = (await query({
      query: selectQuery,
      values: [id],
    })) as RowDataPacket[];
    return rows.length ? (rows[0] as CollectionAttributes) : null;
  } catch (error) {
    console.error("Error retrieving product:", error);
    throw error;
  }
};

// Update a collection
export const updateCollection = async (
  collectionId: string,
  updatedData: Partial<CollectionAttributes>
) => {
  try {
    const { title, description, image } = updatedData;

    const updateQuery = `
      UPDATE collections
      SET title = COALESCE(?, title),
          description = COALESCE(?, description),
          image = COALESCE(?, image),
          updatedAt = NOW()
      WHERE id = ?
    `;

    const result = await query({
      query: updateQuery,
      values: [title ?? null, description ?? null, image ?? null, collectionId], // Convert undefined to null
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

export const getProductsInCollection = async (collectionId: number) => {
  const selectQuery = `
    SELECT p.* 
    FROM ${PRODUCTS_TABLE} p
    JOIN collection_products pc ON pc.productId = p.id
    WHERE pc.collectionId = ?
  `;
  try {
    const products = await query({
      query: selectQuery,
      values: [collectionId],
    });
    return products as ProductAttributes[];
  } catch (error) {
    console.error("Error fetching products in collection:", error);
    throw new Error("Failed to fetch products in collection.");
  }
};

export default {
  initializeCollection,
  createCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  getProductsInCollection,
};
