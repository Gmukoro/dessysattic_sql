import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";

import sequelize from "@/app/api/sequelize.config";

// Fetch collections, products, etc. (These are still using fetch as before)
export const getCollections = async () => {
  try {
    const collections = await fetch(`api/collections`);
    if (!collections.ok) {
      throw new Error(`HTTP error! status: ${collections.status}`);
    }
    return await collections.json();
  } catch (error) {
    console.error("Failed to fetch collections:", error);
    return [];
  }
};

// Fetch collection details
export const getCollectionDetails = async (collectionId: string) => {
  const collection = await fetch(`api/collections/${collectionId}`);
  return await collection.json();
};

// Get total sales and revenue
export const getTotalSales = async () => {
  try {
    const orders = await Order.findAll();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.totalAmount,
      0
    );
    return { totalOrders, totalRevenue };
  } catch (error) {
    console.error("Error fetching total sales:", error);
    return { totalOrders: 0, totalRevenue: 0 };
  }
};

// Get total number of customers
export const getTotalCustomers = async () => {
  try {
    const customers = await Customer.findAll();
    const totalCustomers = customers.length;
    return totalCustomers;
  } catch (error) {
    console.error("Error fetching total customers:", error);
    return 0;
  }
};

// Get sales per month
export const getSalesPerMonth = async () => {
  try {
    const orders = await Order.findAll();
    const salesPerMonth = orders.reduce<{ [key: number]: number }>(
      (acc, order: Order) => {
        const monthIndex = new Date(order.createdAt).getMonth();
        acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
        return acc;
      },
      {}
    );

    const graphData = Array.from({ length: 12 }, (_, i) => {
      const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
        new Date(0, i)
      );
      return { name: month, sales: salesPerMonth[i] || 0 };
    });

    return graphData;
  } catch (error) {
    console.error("Error fetching sales per month:", error);
    return [];
  }
};

// Get all reviews for a product
export const getReviews = async (productId: string) => {
  if (!productId) {
    throw new Error("Product ID is required to fetch reviews");
  }

  try {
    const response = await fetch(`api/review?productId=${productId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
};

// Get searched products
export const getSearchedProducts = async (query: string) => {
  try {
    const response = await fetch(`api/search/${query}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching searched products:", error);
    return [];
  }
};

//yes


export const getProducts = async () => {
  const products = await fetch(`api/products`)
  return await products.json()
}

export const getProductDetails = async (productId: string) => {
  const product = await fetch(`api/products/${productId}`)
  return await product.json()
}



export const getOrders = async (customerId: string) => {
  const orders = await fetch(`api/orders/customers/${customerId}`)
  return await orders.json()
}

export const getRelatedProducts = async (productId: string) => {
  const relatedProducts = await fetch(`api/products/${productId}/related`)
  return await relatedProducts.json()
}