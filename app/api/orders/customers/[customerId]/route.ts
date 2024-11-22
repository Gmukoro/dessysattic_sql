import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/models/Order";

export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  try {
    // Validate customerId
    if (!params.customerId || typeof params.customerId !== "string") {
      return new NextResponse(
        JSON.stringify({ message: "Invalid Customer ID provided" }),
        { status: 400 }
      );
    }

    const ordersResult = await getOrders(params.customerId);

    if (!ordersResult || ordersResult.length === 0) {
      return new NextResponse(
        JSON.stringify({
          message: `No orders found for customer ${params.customerId}`,
        }),
        { status: 404 }
      );
    }

    return NextResponse.json(ordersResult, { status: 200 });
  } catch (err) {
    console.error("[customerId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
