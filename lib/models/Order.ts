//lib\models\Order.ts

import { query } from "@/lib/database";

// Define interfaces for the Order model
export interface OrderAttributes {
  _id?: string;
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
  shippingRate: number | string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  customerId: string;
}
interface TotalSalesResult {
  totalRevenue: number;
  totalOrders: number;
}

// Insert a new order
export const createOrder = async (order: OrderAttributes) => {
  const insertQuery = `
    INSERT INTO orders (products, shippingAddress, shippingRate, totalAmount, createdAt, updatedAt, customerId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  try {
    const result = await query({
      query: insertQuery,
      values: [
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
  id: number // Change to number type
): Promise<OrderAttributes | null> => {
  const selectQuery = `SELECT * FROM orders WHERE _id = ?`;
  try {
    const rows = await query({ query: selectQuery, values: [id] });
    if (Array.isArray(rows) && rows.length > 0) {
      const order = rows[0] as OrderAttributes;
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
  customerId: string // Change to string type to match the customerId type
): Promise<OrderType[]> => {
  const selectQuery = `SELECT * FROM orders WHERE customerId = ?`;
  try {
    const rows = await query({ query: selectQuery, values: [customerId] });

    if (Array.isArray(rows)) {
      return rows.map((row) => {
        const order = row as OrderAttributes & {
          products: string;
          shippingAddress: string;
        };
        order.products = JSON.parse(order.products);
        order.shippingAddress = JSON.parse(order.shippingAddress);
        return order as unknown as OrderType;
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
  id: number, // Change to number type
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
        id, // Use numeric ID here
      ],
    });
    return result;
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};

// Delete an order by ID
export const deleteOrder = async (id: number) => {
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
    JOIN customers ON orders.customerId = customers._id
  `;

  try {
    const rows = await query({ query: selectQuery });

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
  createOrder,
  getOrderById,
  getOrders,
  updateOrder,
  deleteOrder,
  getOrdersWithCustomerDetails,
};
