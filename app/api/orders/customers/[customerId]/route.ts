//app\api\orders\[orderId]\route.ts

import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import sequelize from "@/app/api/sequelize.config";
import { NextRequest, NextResponse } from "next/server";

// Fetch orders by customerId
export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  try {
    await sequelize!.authenticate();

    // Fetch orders associated with the given customerId
    const orders = await Order.findAll({
      where: {
        customerid: params.customerId,
      },
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "price"],
        },
      ],
    });

    if (!orders.length) {
      return new NextResponse(
        JSON.stringify({ message: "No orders found for this customer" }),
        { status: 404 }
      );
    }

    return NextResponse.json(orders, { status: 200 });
  } catch (err) {
    console.error("[customerId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
