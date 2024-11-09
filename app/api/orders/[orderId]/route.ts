import Order from "@/lib/models/Order";
import Customer from "@/lib/models/Customer";
import Product from "@/lib/models/Product";
import { NextRequest, NextResponse } from "next/server";
import sequelize from "@/app/api/sequelize.config";

// GET: Fetch order details including customer and product info
export const GET = async (
  req: NextRequest,
  { params }: { params: { orderId: string } }
) => {
  try {
    await sequelize!.authenticate();

    // Fetch the order and include associated products
    const orderDetails = await Order.findByPk(params.orderId, {
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "name", "price"],
        },
      ],
    });

    if (!orderDetails) {
      return new NextResponse(JSON.stringify({ message: "Order Not Found" }), {
        status: 404,
      });
    }

    // Fetch customer details by the customer id associated with the order
    const customer = await Customer.findOne({
      where: { id: orderDetails.customerid },
    });

    return NextResponse.json({ orderDetails, customer }, { status: 200 });
  } catch (err) {
    console.error("[orderId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
