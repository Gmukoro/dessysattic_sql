//app\api\orders\route.ts

import Order from "@/lib/models/Order";
import Customer from "@/lib/models/Customer";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
import sequelize from "@/app/api/sequelize.config";

// Fetch orders for the admin
export const GET = async (req: NextRequest) => {
  try {
    await sequelize!.authenticate();

    console.log("Attempting to fetch orders...");

    // Fetch orders and sort by createdAt in descending order
    const orders = await Order.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["name", "nextAuthId"],
        },
      ],
    });

    // Map orders to the desired format
    const orderDetails = orders.map((order) => {
      const customer = order.Customer;
      return {
        _id: order._id,
        customer: customer?.name || "Unknown",
        products: order.products.length,
        totalAmount: order.totalAmount,
        createdAt: format(order.createdAt, "MMM do, yyyy"),
      };
    });

    return NextResponse.json(orderDetails, { status: 200 });
  } catch (err) {
    console.log("[orders_GET] Error: ", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
