import { query } from "@/lib/database";
import { OkPacket, RowDataPacket } from "mysql2";

interface PriceRange {
  min: number;
  max: number;
}
// Product interface definition
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
  expense: number;
  collections: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Constants for Table Names
const PRODUCTS_TABLE = "products";
const COLLECTIONS_TABLE = "collection_products";

// Initialize ProductCollections table
export const initializeProductCollectionsTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS collection_products (
      productId INT UNSIGNED NOT NULL,
      collectionId INT UNSIGNED NOT NULL,
      PRIMARY KEY (productId, collectionId),
      FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (collectionId) REFERENCES collections(id) ON DELETE CASCADE
    );
  `;

  try {
    await query({ query: createTableQuery });
    console.log("collection_products table initialized successfully.");
  } catch (error) {
    console.error("Error initializing collection_products table:", error);
  }
};

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
export const createProduct = async (product: ProductAttributes) => {
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

  try {
    const insertProductQuery = `
      INSERT INTO ${PRODUCTS_TABLE} (title, description, media, collections, category, tags, sizes, colors, price, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    const result = await query({
      query: insertProductQuery,
      values: [
        title || "",
        description || "",
        JSON.stringify(media || []),
        category || "Uncategorized",
        JSON.stringify(tags || []),
        JSON.stringify(collections || []),
        JSON.stringify(sizes || []),
        JSON.stringify(colors || []),
        price || 0.0,
      ],
    });

    const okResult = result as OkPacket;
    const productId = okResult.insertId;

    if (collections && collections.length > 0) {
      const collectionBindings = collections.map((collectionId: string) => [
        productId,
        collectionId,
      ]);

      await query({
        query: `INSERT INTO ${COLLECTIONS_TABLE} (productId, collectionId) VALUES ?`,
        values: [collectionBindings],
      });

      console.log("Product successfully bound to collections.");
    }

    return result;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Fetch all products from the database
export const getAllProducts = async (): Promise<ProductAttributes[]> => {
  try {
    const selectQuery = `SELECT * FROM products`;
    const result = (await query({
      query: selectQuery,
    })) as RowDataPacket[];

    const products: ProductAttributes[] = result.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      media: JSON.parse(row.media),
      category: row.category,
      tags: JSON.parse(row.tags),
      sizes: JSON.parse(row.sizes),
      colors: JSON.parse(row.colors),
      collections: JSON.parse(row.collections),
      price: row.price,
      expense: row.expense || 0,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));

    console.log("Fetched products:", products); // Log the result to ensure it's correct
    return products;
  } catch (err) {
    console.error("[getAllProducts Error]:", err); // Log any database errors
    throw err;
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
    values.push(category);
  }
  if (priceRange) {
    condition += " AND price BETWEEN ? AND ?";
    values.push(priceRange.min, priceRange.max);
  }

  try {
    const selectQuery = `SELECT id FROM products WHERE ${condition}`;
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
export const getProductById = async (
  id: number
): Promise<ProductAttributes | null> => {
  try {
    const selectQuery = `SELECT * FROM products WHERE id = ?`;
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

// Fetch related products by product ID
export const getRelatedProducts = async (
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
    })) as RowDataPacket[];

    // Ensure all fields are mapped to ProductAttributes
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      media: JSON.parse(row.media),
      category: row.category,
      tags: JSON.parse(row.tags),
      sizes: JSON.parse(row.sizes),
      colors: JSON.parse(row.colors),
      collections: JSON.parse(row.collections),
      price: row.price,
      expense: row.expense || 0,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};
