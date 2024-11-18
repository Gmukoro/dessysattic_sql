import { query } from "@/lib/database";
import { OkPacket, RowDataPacket } from "mysql2";

export interface ProductAttributes {
  // Existing properties
  priceRange?: { min: number; max: number };
}
// Constants for Table Names
const PRODUCTS_TABLE = "products";
const COLLECTIONS_TABLE = "product_collections";

// Initialize ProductCollections table
export const initializeProductCollectionsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ProductCollections (
      productId INT UNSIGNED NOT NULL,
      collectionId INT UNSIGNED NOT NULL,
      PRIMARY KEY (productId, collectionId),
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (collectionId) REFERENCES collections(id) ON DELETE CASCADE
    );
  `;

  try {
    await query({ query: createTableQuery });
    console.log("ProductCollections table initialized successfully.");
  } catch (error) {
    console.error("Error initializing ProductCollections table:", error);
  }
};

// Define the attributes for a Product
export interface ProductAttributes {
  id: string;
  title: string;
  description: string;
  media: string[];
  category: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  price: number;
  expense?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Utility function for safely converting to JSON string
const safeJSONStringify = (data: unknown): string => JSON.stringify(data || []);

// Initialize the Products table
export const initializeProductTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${PRODUCTS_TABLE} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      media JSON,
      category VARCHAR(100) NOT NULL,
      tags JSON,
      sizes JSON,
      colors JSON,
      price DECIMAL(10, 2) NOT NULL,
      expense DECIMAL(10, 2),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  try {
    await query({ query: createTableQuery });
    console.log(`Table '${PRODUCTS_TABLE}' initialized successfully.`);
  } catch (error) {
    console.error(`Error initializing '${PRODUCTS_TABLE}' table:`, error);
  }
};

// CRUD Operations

// Create a new product
export const createProduct = async (product: ProductAttributes) => {
  const insertQuery = `
    INSERT INTO products (title, description, media, category, tags, sizes, colors, price, expense)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const result = await query({
      query: insertQuery,
      values: [
        product.title,
        product.description || null,
        JSON.stringify(product.media || []),
        product.category,
        JSON.stringify(product.tags || []),
        JSON.stringify(product.sizes || []),
        JSON.stringify(product.colors || []),
        product.price,
        product.expense || null,
      ],
    });
    return {
      id: (result as OkPacket).insertId,
      title: product.title,
      description: product.description,
      media: product.media,
      category: product.category,
      tags: product.tags,
      sizes: product.sizes,
      colors: product.colors,
      price: product.price,
      expense: product.expense,
    };
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const getProductIdsByCriteria = async (
  criteria: Partial<ProductAttributes>
): Promise<number[]> => {
  const { title, category, priceRange } = criteria;
  let condition = "1=1";
  const values: (string | number)[] = [];

  if (title) {
    condition += " AND title LIKE ?";
    values.push(`%${title}%`);
  }
  if (category) {
    condition += " AND category = ?";
    values.push(category);
  }
  if (priceRange) {
    condition += " AND price BETWEEN ? AND ?";
    values.push(priceRange.min, priceRange.max);
  }

  const selectQuery = `SELECT id FROM products WHERE ${condition}`;
  try {
    const rows = (await query({ query: selectQuery, values })) as RowDataPacket[];
    return rows.map((row: RowDataPacket) => row.id as number);
  } catch (error) {
    console.error("Error fetching product IDs by criteria:", error);
    throw error;
  }
};


// Get a product by ID
export const getProductById = async (
  id: number
): Promise<ProductAttributes | null> => {
  const selectQuery = `SELECT * FROM products WHERE id = ?`;
  try {
    const rows = (await query({
      query: selectQuery,
      values: [id],
    })) as RowDataPacket[];
    return rows.length ? (rows[0] as ProductAttributes) : null;
  } catch (error) {
    console.error("Error retrieving product:", error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (
  id: number,
  updateData: Partial<ProductAttributes>
) => {
  const updateQuery = `
    UPDATE products
    SET title = ?, description = ?, media = ?, category = ?, tags = ?, sizes = ?, colors = ?, price = ?, expense = ?
    WHERE id = ?
  `;
  try {
    const result = await query({
      query: updateQuery,
      values: [
        updateData.title,
        updateData.description,
        JSON.stringify(updateData.media || []),
        updateData.category,
        JSON.stringify(updateData.tags || []),
        JSON.stringify(updateData.sizes || []),
        JSON.stringify(updateData.colors || []),
        updateData.price,
        updateData.expense || null,
        id,
      ],
    });
    return result;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: number) => {
  const deleteQuery = `DELETE FROM products WHERE id = ?`;
  try {
    const result = await query({ query: deleteQuery, values: [id] });
    return result;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Many-to-Many Association Setup: Product-Collection Relationship
export const addProductToCollection = async (
  productId: number,
  collectionId: number
) => {
  const insertQuery = `
    INSERT INTO ProductCollections (productId, collectionId)
    VALUES (?, ?)
  `;
  try {
    const result = await query({
      query: insertQuery,
      values: [productId, collectionId],
    });
    return result;
  } catch (error) {
    console.error("Error adding product to collection:", error);
    throw error;
  }
};

// Remove a product from a collection
export const removeProductFromCollection = async (
  productId: number,
  collectionId: number
) => {
  const deleteQuery = `
    DELETE FROM ProductCollections WHERE productId = ? AND collectionId = ?
  `;
  try {
    const result = await query({
      query: deleteQuery,
      values: [productId, collectionId],
    });
    return result;
  } catch (error) {
    console.error("Error removing product from collection:", error);
    throw error;
  }
};

// Fetch all collections for a product
export const getCollectionsForProduct = async (productId: number) => {
  const selectQuery = `
    SELECT c.id, c.title, c.description FROM collections c
    JOIN ProductCollections pc ON c.id = pc.collectionId
    WHERE pc.productId = ?
  `;
  try {
    const collections = await query({
      query: selectQuery,
      values: [productId],
    });
    return collections;
  } catch (error) {
    console.error("Error fetching collections for product:", error);
    throw error;
  }
};

// Get all products
export const getAllProducts = async (): Promise<ProductAttributes[]> => {
  const selectQuery = `SELECT * FROM products`;
  try {
    const rows = (await query({ query: selectQuery })) as RowDataPacket[];
    return rows as ProductAttributes[];
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

// Fetch related products based on the same category
export const getRelatedProducts = async (
  product: ProductAttributes
): Promise<ProductAttributes[]> => {
  const relatedQuery = `
    SELECT * FROM products
    WHERE category = ? AND id != ?
    LIMIT 5
  `;
  try {
    const rows = (await query({
      query: relatedQuery,
      values: [product.category, product.id],
    })) as ProductAttributes[];
    return rows;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};

// Fetch all products in a collection
export const getProductsInCollection = async (collectionId: number) => {
  const selectQuery = `
    SELECT p.* 
    FROM ${PRODUCTS_TABLE} p
    JOIN ${COLLECTIONS_TABLE} pc ON pc.product_id = p.id
    WHERE pc.collection_id = ?
  `;

  try {
    // Execute the query
    const rows = await query({ query: selectQuery, values: [collectionId] });

    // Assert the result type as an array of RowDataPacket[]
    return rows as RowDataPacket[];
  } catch (error) {
    console.error("Error fetching products in collection:", error);
    throw error;
  }
};

export const updateProductCollections = async (
  productId: number,
  collections: number[]
) => {
  const deleteQuery = "DELETE FROM product_collections WHERE productId = ?";
  const insertQuery =
    "INSERT INTO product_collections (productId, collectionId) VALUES (?, ?)";

  try {
    // Clear existing associations
    await query({ query: deleteQuery, values: [productId] });

    // Add new associations
    await Promise.all(
      collections.map((collectionId) =>
        query({ query: insertQuery, values: [productId, collectionId] })
      )
    );
  } catch (err) {
    console.error("Error updating product collections:", err);
    throw err;
  }
};

// Fetch products by collection ID
export const getProductsByCollectionId = async (
  collectionId: number
): Promise<ProductAttributes[]> => {
  const selectQuery = `
    SELECT p.id, p.title, p.description, p.media, p.category, p.tags, p.sizes, p.colors, p.price, p.expense
    FROM products p
    JOIN ProductCollections pc ON p.id = pc.productId
    WHERE pc.collectionId = ?
  `;
  try {
    const products = await query({
      query: selectQuery,
      values: [collectionId],
    });
    return products as ProductAttributes[];
  } catch (error) {
    console.error("Error fetching products by collection ID:", error);
    throw error;
  }
};

export default {
  initializeProductCollectionsTable,
  initializeProductTable,
  createProduct,
  getProductById,
  getProductIdsByCriteria,
  updateProduct,
  deleteProduct,
  addProductToCollection,
  removeProductFromCollection,
  getCollectionsForProduct,
  getAllProducts,
  getRelatedProducts,
  getProductsInCollection,
  updateProductCollections,
  getProductsByCollectionId,
};
