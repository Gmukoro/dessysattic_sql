import { query } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket } from "mysql2";

export const GET = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  try {
    // Fetch the order by ID
    const orderQuery = `
      SELECT * FROM orders WHERE _id = ?;
    `;
    const orderResult = (await query({
      query: orderQuery,
      values: [params.orderId],
    })) as RowDataPacket[];

    // Check if the orderResult is an array and has a length
    if (!orderResult || orderResult.length === 0) {
      return new NextResponse(JSON.stringify({ message: "Order Not Found" }), {
        status: 404,
      });
    }

    const order = orderResult[0];

    // Fetch associated products from the order
    const productsQuery = `
      SELECT * FROM products WHERE _id IN (SELECT product FROM JSON_EXTRACT(?, '$[*].product'));
    `;
    const productsResult = (await query({
      query: productsQuery,
      values: [order.products],
    })) as RowDataPacket[];

    // Fetch customer details using customerId from order
    const customerQuery = `
      SELECT * FROM customers WHERE id = ?;
    `;
    const customerResult = (await query({
      query: customerQuery,
      values: [order.customerId],
    })) as RowDataPacket[];

    // Ensure that customerResult contains data before accessing [0]
    const customer = customerResult.length > 0 ? customerResult[0] : null;

    return NextResponse.json(
      { order, products: productsResult, customer },
      { status: 200 }
    );
  } catch (err) {
    console.error("[orderId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
