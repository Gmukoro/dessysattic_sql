import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/models/Order";

export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  try {
    // Fetch orders for the customer using the model
    const ordersResult = await getOrders(params.customerId);

    if (ordersResult.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No orders found for this customer" }),
        { status: 404 }
      );
    }

    // Return order details
    return NextResponse.json(ordersResult, { status: 200 });
  } catch (err) {
    console.error("[customerId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
