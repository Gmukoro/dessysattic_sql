import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/models/Order";

export const GET = async (
  req: NextRequest,
  context: { params: { orderId: string } }
) => {
  try {
    const { orderId } = await context.params;

    const orderIdInt = parseInt(orderId, 10);
    // Validate orderId
    if (!orderId) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid Order ID provided" }),
        { status: 400 }
      );
    }

    const order = await getOrderById(orderIdInt);

    if (!order) {
      return new NextResponse(
        JSON.stringify({
          message: `Order Not Found at /orders/${orderId}`,
        }),
        { status: 404 }
      );
    }

    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("[orderId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
