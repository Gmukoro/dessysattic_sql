import { query } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import { RowDataPacket } from "mysql2";

export const GET = async (req: NextRequest) => {
  try {
    // Fetch orders and sort by createdAt descending
    const ordersQuery = `
      SELECT * FROM orders ORDER BY createdAt DESC;
    `;
    const ordersResult = (await query({
      query: ordersQuery,
    })) as RowDataPacket[];

    if (Array.isArray(ordersResult) && ordersResult.length === 0) {
      return new NextResponse(JSON.stringify({ message: "No orders found" }), {
        status: 404,
      });
    }

    // Fetch customer details for each order
    const orderDetails = [];
    for (const order of ordersResult) {
      const customerQuery = `
        SELECT name, nextAuthId FROM customers WHERE id = ?;
      `;
      const customerResult = (await query({
        query: customerQuery,
        values: [order.customerId],
      })) as RowDataPacket[];

      orderDetails.push({
        _id: order._id,
        customer: customerResult[0]?.name || "Unknown",
        products: order.products.length,
        totalAmount: order.totalAmount,
        createdAt: format(order.createdAt, "MMM do, yyyy"),
      });
    }

    return NextResponse.json(orderDetails, { status: 200 });
  } catch (err) {
    console.error("[orders_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
