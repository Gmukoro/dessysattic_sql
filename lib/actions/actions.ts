import { query } from "@/lib/database";
import { OrderAttributes } from "@/lib/models/Order";
import { RowDataPacket } from "mysql2";

// Get total sales and revenue
export const getTotalSales = async () => {
  try {
    const result = await query({
      query:
        "SELECT SUM(totalAmount) AS totalRevenue, COUNT(*) AS totalOrders FROM orders",
    });

    if (Array.isArray(result) && result.length > 0) {
      const { totalRevenue, totalOrders } = result[0] as {
        totalRevenue: number;
        totalOrders: number;
      }; // Type assertion
      return {
        totalOrders,
        totalRevenue: totalRevenue || 0,
      };
    }

    return { totalOrders: 0, totalRevenue: 0 };
  } catch (error) {
    console.error("Error fetching total sales:", error);
    return { totalOrders: 0, totalRevenue: 0 };
  }
};

// Get total number of customers
export const getTotalCustomers = async () => {
  try {
    const customers = await query({
      query: "SELECT * FROM customers",
    });
    const totalCustomers = (customers as RowDataPacket[]).length; 
    return totalCustomers;
  } catch (error) {
    console.error("Error fetching total customers:", error);
    return 0;
  }
};

// Get sales per month
export const getSalesPerMonth = async () => {
  try {
    // Execute query
    const result = await query({
      query: "SELECT * FROM orders",
    });

    // Filter out OkPacket types if present
    const orders: RowDataPacket[] = (
      Array.isArray(result)
        ? result.filter((item) => {
            return (item as RowDataPacket).constructor.name === "RowDataPacket";
          })
        : []
    ) as RowDataPacket[];

    // Use reduce to accumulate sales per month
    const salesPerMonth = orders.reduce<{ [key: number]: number }>(
      (acc, order) => {
        const orderData = order as OrderAttributes;
        const monthIndex = new Date(orderData.createdAt).getMonth();
        acc[monthIndex] = (acc[monthIndex] || 0) + orderData.totalAmount;
        return acc;
      },
      {}
    );

    // Generate graph data
    const graphData = Array.from({ length: 12 }, (_, i) => {
      const month = new Intl.DateTimeFormat("en-US", {
        month: "short",
      }).format(new Date(0, i));
      return { name: month, sales: salesPerMonth[i] || 0 };
    });

    return graphData;
  } catch (error) {
    console.error("Error fetching sales per month:", error);
    return [];
  }
};
