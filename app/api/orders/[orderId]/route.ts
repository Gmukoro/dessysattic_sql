import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/models/Order";

export const GET = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  try {
    // Fetch the order by ID using the model
    const order = await getOrderById(params.orderId); // Fetch the order by ID

    if (!order) {
      return new NextResponse(JSON.stringify({ message: "Order Not Found" }), {
        status: 404,
      });
    }

    // Fetch associated product and customer details here if necessary
    return NextResponse.json(order, { status: 200 });
  } catch (err) {
    console.error("[orderId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
