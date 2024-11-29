import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import { getOrdersWithCustomerDetails } from "@/lib/models/Order";

export const GET = async (req: NextRequest) => {
  try {
    const ordersResult = await getOrdersWithCustomerDetails();

    if (!ordersResult || ordersResult.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No orders found at /orders" }),
        { status: 404 }
      );
    }

    const orderDetails = ordersResult.map((order) => ({
      id: order._id,
      customer: order.customerName,
      products: order.products.length,
      totalAmount: order.totalAmount,
      createdAt: format(new Date(order.createdAt), "MMM do, yyyy"),
    }));

    return NextResponse.json(orderDetails, { status: 200 });
  } catch (err) {
    console.error("[orders_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Ensures server-side execution
export const dynamic = "force-dynamic";
