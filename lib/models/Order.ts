//lib\models\Order.ts

import { query } from "@/lib/database";

// Define interfaces for the Order model
export interface OrderAttributes {
  _id: string;
  products: Array<{
    product: {
      id: string;
      title: string;
      media: string[];
      price: number;
    };
    color: string;
    size: string;
    quantity: number;
  }>;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingRate: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
}
interface TotalSalesResult {
  totalRevenue: number;
  totalOrders: number;
}

// Initialize the Orders table if it doesn’t exist
export const initializeOrderTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS orders (
        _id VARCHAR(255) PRIMARY KEY,
        products JSON NOT NULL,
        shippingAddress JSON NOT NULL,
        shippingRate VARCHAR(100) NOT NULL,
        totalAmount FLOAT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        customerId VARCHAR(255) NOT NULL,
        FOREIGN KEY (customerId) REFERENCES customers(_id)
      );
    `;
    await query({ query: createTableQuery });
    console.log("Orders table initialized successfully.");
  } catch (error) {
    console.error("Error initializing Orders table:", error);
  }
};

// Insert a new order
export const createOrder = async (order: OrderAttributes) => {
  const insertQuery = `
    INSERT INTO orders (id, products, shippingAddress, shippingRate, totalAmount, createdAt, updatedAt, customerId)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const result = await query({
      query: insertQuery,
      values: [
        order._id,
        JSON.stringify(order.products),
        JSON.stringify(order.shippingAddress),
        order.shippingRate,
        order.totalAmount,
        order.createdAt || new Date(),
        order.updatedAt || new Date(),
        order.customerId,
      ],
    });
    return result;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Retrieve an order by ID
export const getOrderById = async (
  id: string
): Promise<OrderAttributes | null> => {
  const selectQuery = `SELECT * FROM orders WHERE id = ?`;
  try {
    const rows = await query({ query: selectQuery, values: [_id] });
    if (Array.isArray(rows) && rows.length > 0) {
      const order = rows[0] as OrderAttributes;
      // Parse JSON columns for products and shippingAddress
      order.products = JSON.parse(order.products as any);
      order.shippingAddress = JSON.parse(order.shippingAddress as any);
      return order;
    }
    return null;
  } catch (error) {
    console.error("Error retrieving order:", error);
    throw error;
  }
};

// Retrieve all orders for a specific customer
export const getOrders = async (
  customerId: string
): Promise<OrderAttributes[]> => {
  const selectQuery = `SELECT * FROM orders WHERE customerId = ?`;
  try {
    const rows = await query({ query: selectQuery, values: [customerId] });

    // Ensure rows are an array before proceeding
    if (Array.isArray(rows)) {
      return rows.map((row) => {
        const order = row as {
          products: string;
          shippingAddress: string;
        } & OrderAttributes;
        order.products = JSON.parse(order.products);
        order.shippingAddress = JSON.parse(order.shippingAddress);
        return order;
      });
    }
    return [];
  } catch (error) {
    console.error("Error retrieving orders:", error);
    return [];
  }
};

// Update an order
export const updateOrder = async (
  id: string,
  updateData: Partial<OrderAttributes>
) => {
  const updateQuery = `
    UPDATE orders
    SET products = ?, shippingAddress = ?, shippingRate = ?, totalAmount = ?, updatedAt = ?, customerId = ?
    WHERE _id = ?
  `;
  try {
    const result = await query({
      query: updateQuery,
      values: [
        JSON.stringify(updateData.products),
        JSON.stringify(updateData.shippingAddress),
        updateData.shippingRate,
        updateData.totalAmount,
        new Date(),
        updateData.customerId,
        id,
      ],
    });
    return result;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

// Delete an order by ID
export const deleteOrder = async (id: string) => {
  const deleteQuery = `DELETE FROM orders WHERE _id = ?`;
  try {
    const result = await query({ query: deleteQuery, values: [id] });
    return result;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export const getOrdersWithCustomerDetails = async (): Promise<
  Array<
    OrderAttributes & {
      customerName: string;
    }
  >
> => {
  const selectQuery = `
    SELECT 
      orders._id, 
      orders.products, 
      orders.shippingAddress, 
      orders.shippingRate, 
      orders.totalAmount, 
      orders.createdAt, 
      orders.updatedAt, 
      customers.name AS customerName 
    FROM orders
    JOIN customers ON orders.customerId = customers.id
  `;

  try {
    const rows = await query({ query: selectQuery });

    // Ensure rows are an array before proceeding
    if (Array.isArray(rows)) {
      return rows.map((row) => {
        const order = row as {
          products: string;
          shippingAddress: string;
        } & OrderAttributes & { customerName: string };
        order.products = JSON.parse(order.products);
        order.shippingAddress = JSON.parse(order.shippingAddress);
        return order;
      });
    }
    return [];
  } catch (error) {
    console.error("Error retrieving orders with customer details:", error);
    throw error;
  }
};

export default {
  initializeOrderTable,
  createOrder,
  getOrderById,
  getOrders,
  updateOrder,
  deleteOrder,
  getOrdersWithCustomerDetails,
};
