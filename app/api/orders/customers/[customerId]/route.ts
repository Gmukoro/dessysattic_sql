import { query } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2"; // Ensure RowDataPacket is imported

export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  try {
    // Fetch orders for a customer
    const ordersQuery = `
      SELECT * FROM orders WHERE customerId = ?;
    `;
    const ordersResult = (await query({
      query: ordersQuery,
      values: [params.customerId],
    })) as RowDataPacket[];

    if (ordersResult.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No orders found for this customer" }),
        { status: 404 }
      );
    }

    // Fetch product details for each order
    const orderDetails = [];
    for (const order of ordersResult) {
      const productsQuery = `
        SELECT * FROM products WHERE _id IN (SELECT product FROM JSON_EXTRACT(?, '$[*].product'));
      `;
      const productsResult = (await query({
        query: productsQuery,
        values: [order.products],
      })) as RowDataPacket[]; // Type assertion to RowDataPacket[]

      orderDetails.push({ ...order, products: productsResult });
    }

    return NextResponse.json(orderDetails, { status: 200 });
  } catch (err) {
    console.error("[customerId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
