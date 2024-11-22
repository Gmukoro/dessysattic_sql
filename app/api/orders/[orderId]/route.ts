import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/models/Order";

export const GET = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  try {
    // Validate orderId
    if (!params.orderId || typeof params.orderId !== "string") {
      return new NextResponse(
        JSON.stringify({ message: "Invalid Order ID provided" }),
        { status: 400 }
      );
    }

    const order = await getOrderById(params.orderId);

    if (!order) {
      return new NextResponse(
        JSON.stringify({
          message: `Order Not Found at /orders/${params.orderId}`,
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
