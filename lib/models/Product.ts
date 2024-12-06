import { query } from "@/lib/database";
import { OkPacket, ResultSetHeader, RowDataPacket } from "mysql2";
import { CollectionType } from "../types";

interface PriceRange {
  min: number;
  max: number;
}

// Helper function to parse JSON safely
const parseJsonSafe = (data: any): any => {
  try {
    // Only attempt to parse if the data looks like a JSON array or object
    if (
      typeof data === "string" &&
      (data.startsWith("[") || data.startsWith("{"))
    ) {
      return JSON.parse(data || "[]");
    }
    // Return data as-is if it's not a JSON string
    return data;
  } catch (error) {
    console.error("Invalid JSON format:", data);
    return data;
  }
};

// Product interface definition
export interface ProductAttributes {
  id: string;
  title: string;
  description: string;
  media: string[];
  category: string[];
  tags: string[];
  sizes: string[];
  colors: string[];
  price: number;
  expense: number;
  collections: CollectionType[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Constants for Table Names
const PRODUCTS_TABLE = "products";
const COLLECTIONS_TABLE = "collection_products";

// Initialize indexes
export const initializeIndexes = async () => {
  const indexes = [
    `CREATE INDEX IF NOT EXISTS idx_collections_title ON collections(title)`,
    `CREATE INDEX IF NOT EXISTS idx_collection_products_collectionId ON collection_products(collectionId)`,
    `CREATE INDEX IF NOT EXISTS idx_products_id ON products(id)`,
  ];

  try {
    await Promise.all(
      indexes.map((indexQuery) => query({ query: indexQuery }))
    );
    console.log("Indexes created successfully.");
  } catch (error) {
    console.error("Error creating indexes:", error);
  }
};

// Create a new product and automatically bind it to collections
export const createProduct = async (
  product: ProductAttributes
): Promise<OkPacket | null> => {
  const {
    title,
    description,
    media,
    category,
    tags,
    sizes,
    colors,
    collections,
    price,
  } = product;

  const insertProductQuery = `
    INSERT INTO ${PRODUCTS_TABLE} (title, description, media, category, tags, sizes, colors, price, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  try {
    // Insert the product into the database
    const result = await query({
      query: insertProductQuery,
      values: [
        title || "",
        description || "",
        JSON.stringify(media || []),
        JSON.stringify(category || []),
        JSON.stringify(tags || []),
        JSON.stringify(sizes || []),
        JSON.stringify(colors || []),
        price || 0.0,
      ],
    });

    // Ensure result is an OkPacket and extract insertId
    const okResult = result as OkPacket;
    const productId = okResult.insertId;

    // If collections are provided, check for their existence and bind the product to them
    if (collections && collections.length > 0) {
      for (const collectionName of collections) {
        // Query to find the collection by name
        const collectionQuery = `SELECT id FROM ${COLLECTIONS_TABLE} WHERE title = ?`;
        const collectionResult = (await query({
          query: collectionQuery,
          values: [collectionName],
        })) as RowDataPacket[];

        if (collectionResult.length > 0) {
          // Collection exists, retrieve its ID
          const collectionId = collectionResult[0].id;

          // Insert the product-collection relationship
          await query({
            query: `INSERT INTO ${COLLECTIONS_TABLE} (productId, collectionId) VALUES (?, ?)`,
            values: [productId, collectionId],
          });

          console.log(
            `Product successfully bound to collection: ${collectionName}`
          );
        } else {
          console.log(
            `Collection '${collectionName}' does not exist. Skipping binding.`
          );
        }
      }
    }

    return okResult;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Fetch all products from the database
export const getAllProducts = async (): Promise<ProductAttributes[]> => {
  try {
    const selectAllProductsQuery = `SELECT p.* FROM products p`;
    const results = await query({ query: selectAllProductsQuery });

    const products = results as RowDataPacket[];
    return products.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      media: parseJsonSafe(row.media),
      category: parseJsonSafe(row.category),
      tags: parseJsonSafe(row.tags),
      sizes: parseJsonSafe(row.sizes),
      colors: parseJsonSafe(row.colors),
      price: row.price,
      expense: row.expense || 0,
      collections: parseJsonSafe(row.collections),
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    }));
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

// Fetch product IDs by criteria
export const getProductIdsByCriteria = async (
  criteria: Partial<ProductAttributes> & { priceRange?: PriceRange }
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
    values.push(`%${category}%`);
  }
  if (priceRange) {
    condition += " AND price BETWEEN ? AND ?";
    values.push(priceRange.min, priceRange.max);
  }

  try {
    const selectQuery = `SELECT id FROM ${PRODUCTS_TABLE} WHERE ${condition}`;
    const rows = (await query({
      query: selectQuery,
      values,
    })) as RowDataPacket[];
    return rows.map((row: RowDataPacket) => row.id as number);
  } catch (error) {
    console.error("Error fetching product IDs by criteria:", error);
    throw error;
  }
};

// Get product by ID
export const fetchProductById = async (
  id: number
): Promise<ProductAttributes | null> => {
  const queryString = `
    SELECT * FROM products WHERE id = ?;
  `;

  try {
    // Execute query and get result
    const result = await query({
      query: queryString,
      values: [id],
    });

    // Assuming `result` is an array of rows
    const rows = result as RowDataPacket[];

    // If no rows are returned, return null
    if (rows.length === 0) {
      return null;
    }

    const product = rows[0];

    // Map the returned row to ProductAttributes type
    const productAttributes: ProductAttributes = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      expense: product.expense,
      media: parseJsonSafe(product.media),
      category: parseJsonSafe(product.category),
      tags: parseJsonSafe(product.tags),
      sizes: parseJsonSafe(product.sizes),
      colors: parseJsonSafe(product.colors),
      collections: parseJsonSafe(product.collections),
      createdAt: product.createdAt ? new Date(product.createdAt) : undefined,
      updatedAt: product.updatedAt ? new Date(product.updatedAt) : undefined,
    };

    return productAttributes;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

// Update product details
export const updateProduct = async (
  id: number,
  updateData: Partial<ProductAttributes>
) => {
  const updateQuery = `
    UPDATE products SET 
    title = ?, description = ?, media = ?, category = ?, 
    tags = ?, sizes = ?, colors = ?, price = ?, expense = ? 
    WHERE id = ?
  `;

  try {
    const result = await query({
      query: updateQuery,
      values: [
        updateData.title,
        updateData.description,
        JSON.stringify(updateData.media || []),
        JSON.stringify(updateData.category || []),
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

// Delete product
export const deleteProduct = async (id: number) => {
  try {
    const deleteQuery = `DELETE FROM products WHERE id = ?`;
    const result = await query({ query: deleteQuery, values: [id] });
    return result;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Bind products to collections (optimized for batch operations)
export const addProductsToCollection = async (
  collectionName: string,
  productIds: number[]
) => {
  try {
    const addProductsQuery = `
      CALL add_products_to_collection(?, ?);
    `;
    const productIdsJson = JSON.stringify(productIds);
    const result = await query({
      query: addProductsQuery,
      values: [collectionName, productIdsJson],
    });

    console.log("Products successfully added to the collection:", result);
    return result;
  } catch (error) {
    console.error("Error adding products to collection:", error);
    throw error;
  }
};

// Fetch all collections for a product
export const getCollectionsForProduct = async (
  productId: number
): Promise<string[]> => {
  try {
    const selectQuery = `
      SELECT collectionId FROM collection_products WHERE productId = ?
    `;
    const rows = (await query({
      query: selectQuery,
      values: [productId],
    })) as RowDataPacket[];
    return rows.map((row) => row.collectionId.toString());
  } catch (error) {
    console.error("Error fetching collections for product:", error);
    throw error;
  }
};

// Fetch products for a collection
export const getProductsForCollection = async (
  collectionId: number
): Promise<ProductAttributes[]> => {
  try {
    const selectQuery = `
      SELECT p.* 
      FROM products p 
      JOIN collection_products cp ON p.id = cp.productId
      WHERE cp.collectionId = ?
    `;
    const rows = (await query({
      query: selectQuery,
      values: [collectionId],
    })) as RowDataPacket[];

    // Parse media and other JSON fields
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      media: JSON.parse(row.media || "[]"),
      category: JSON.parse(row.category || "[]"),
      tags: JSON.parse(row.tags || "[]"),
      sizes: JSON.parse(row.sizes || "[]"),
      colors: JSON.parse(row.colors || "[]"),
      collections: JSON.parse(row.collections || "[]"),
      price: row.price,
      expense: row.expense || 0,
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    }));
  } catch (error) {
    console.error("Error fetching products for collection:", error);
    throw error;
  }
};

//special delimeter function add products to collection by name

export const getCollectionProductsByName = async (
  collectionName: string
): Promise<ProductAttributes[] | null> => {
  const selectQuery = `
    SELECT p.* 
    FROM products p
    JOIN collection_products cp ON p.id = cp.productId
    JOIN collections c ON cp.collectionId = c.id
    WHERE c.title = ?
  `;

  try {
    const rows = await query({ query: selectQuery, values: [collectionName] });

    const products = rows as RowDataPacket[];

    if (products.length === 0) return null;

    return products.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      media: parseJsonSafe(row.media),
      category: parseJsonSafe(row.category),
      tags: parseJsonSafe(row.tags),
      sizes: parseJsonSafe(row.sizes),
      colors: parseJsonSafe(row.colors),
      price: row.price,
      expense: row.expense || 0,
      collections: parseJsonSafe(row.collections),
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    }));
  } catch (error) {
    console.error(
      `Error fetching products for collection '${collectionName}':`,
      error
    );
    throw error; // Rethrow the error after logging it
  }
};

// Fetch the collection ID by its title
export const getCollectionIdByTitle = async (
  collectionTitle: string
): Promise<number | null> => {
  const selectQuery = `SELECT id FROM collections WHERE title = ?`;
  try {
    const rows = (await query({
      query: selectQuery,
      values: [collectionTitle],
    })) as RowDataPacket[];

    // Ensure rows is an array of RowDataPacket and return the id if found
    return rows.length > 0 ? rows[0].id : null;
  } catch (error) {
    console.error("Error fetching collection ID by title:", error);
    throw error;
  }
};

export const getCollectionProductsById = async (
  collectionId: number
): Promise<ProductAttributes[] | null> => {
  const selectQuery = `
    SELECT p.* 
    FROM products p
    JOIN collection_products cp ON p.id = cp.productId
    JOIN collections c ON cp.collectionId = c.id
    WHERE c.id = ?
  `;

  try {
    const rows = await query({ query: selectQuery, values: [collectionId] });

    const products = rows as RowDataPacket[];

    if (products.length === 0) return null;

    return products.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      media: parseJsonSafe(row.media),
      category: parseJsonSafe(row.category),
      tags: parseJsonSafe(row.tags),
      sizes: parseJsonSafe(row.sizes),
      colors: parseJsonSafe(row.colors),
      price: row.price,
      expense: row.expense || 0,
      collections: parseJsonSafe(row.collections),
      createdAt: row.createdAt ? new Date(row.createdAt) : undefined,
      updatedAt: row.updatedAt ? new Date(row.updatedAt) : undefined,
    }));
  } catch (error) {
    console.error(
      `Error fetching products for collection with ID '${collectionId}':`,
      error
    );
    throw error;
  }
};

// Fetch related products based on a given product ID and criteria
export const fetchRelatedProducts = async (
  productId: number
): Promise<ProductAttributes[]> => {
  try {
    const selectQuery = `
      SELECT p.* FROM products p
      INNER JOIN collection_products cp ON p.id = cp.productId
      WHERE cp.collectionId IN (
        SELECT collectionId FROM collection_products WHERE productId = ?
      ) AND p.id != ?
    `;
    const rows = (await query({
      query: selectQuery,
      values: [productId, productId],
    })) as ProductAttributes[];

    // Ensure all fields are mapped to ProductAttributes
    return rows as ProductAttributes[];
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};

// Fetch all products in a user's wishlist
export const getUserWishlistProducts = async (
  userId: number
): Promise<ProductAttributes[]> => {
  try {
    // Step 1: Get the wishlist (JSON array) for the user
    const wishlistQuery = `
      SELECT JSON_EXTRACT(wishlist, '$') AS wishlist
      FROM users
      WHERE id = ?
    `;

    const wishlistResult = (await query({
      query: wishlistQuery,
      values: [userId], // Pass the userId to fetch the correct user data
    })) as RowDataPacket[];

    console.log("Wishlist query result:", wishlistResult);

    const wishlist = wishlistResult[0]?.wishlist
      ? JSON.parse(wishlistResult[0].wishlist)
      : [];

    console.log("Parsed wishlist:", wishlist);

    if (!wishlist.length) {
      return []; // Return an empty array if the wishlist is empty
    }

    // Step 2: Fetch products matching the IDs in the wishlist
    const productsQuery = `
      SELECT *
      FROM products
      WHERE id IN (?)
    `;

    console.log("Fetching products for wishlist IDs:", wishlist);

    // Pass the wishlist array as a separate parameter for IN clause
    const rows = (await query({
      query: productsQuery,
      values: [wishlist],
    })) as ProductAttributes[];

    console.log("Product rows fetched:", rows);

    // Map rows to ProductAttributes and return
    return rows;
  } catch (error) {
    console.error("Error fetching wishlist products for user:", error);
    throw error;
  }
};
