//app\api\orders\route.ts

import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import { getOrders, getOrdersWithCustomerDetails } from "@/lib/models/Order";

export const GET = async (req: NextRequest) => {
  try {
    // Fetch all orders with customer details
    const ordersResult = await getOrdersWithCustomerDetails();

    if (ordersResult.length === 0) {
      return new NextResponse(JSON.stringify({ message: "No orders found" }), {
        status: 404,
      });
    }

    // Format the response
    const orderDetails = ordersResult.map((order) => ({
      _id: order._id,
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

export const dynamic = "force-dynamic";
