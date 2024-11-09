//app\api\webhook\route.ts

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import sequelize from "@/app/api/sequelize.config";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";

export const POST = async (req: NextRequest) => {
  try {
    // Ensure the connection to the MySQL database is established
    await sequelize!.authenticate();

    const rawBody = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const customerInfo = {
        userId: session?.client_reference_id,
        name: session?.customer_details?.name,
        email: session?.customer_details?.email,
      };

      const shippingAddress = {
        street: session?.shipping_details?.address?.line1,
        city: session?.shipping_details?.address?.city,
        state: session?.shipping_details?.address?.state,
        postalCode: session?.shipping_details?.address?.postal_code,
        country: session?.shipping_details?.address?.country,
      };

      const retrieveSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items.data.price.product"] }
      );

      const lineItems = await retrieveSession?.line_items?.data;

      const orderItems = lineItems?.map((item: any) => {
        return {
          product: item.price.product.metadata.productId,
          color: item.price.product.metadata.color || "N/A",
          size: item.price.product.metadata.size || "N/A",
          quantity: item.quantity,
        };
      });

      // Create a new order entry in the database
      const newOrder = await Order.create({
        customerId: customerInfo.userId,
        products: orderItems,
        shippingAddress,
        shippingRate: session?.shipping_cost?.shipping_rate,
        totalAmount: session.amount_total ? session.amount_total / 100 : 0,
      });

      let customer = await Customer.findOne({
        where: { id: customerInfo.userId },
      });

      if (customer) {
        // Add the new order to the customer's orders list
        await customer.addOrder(newOrder);
      } else {
        // If the customer doesn't exist, create a new one
        customer = await Customer.create({
          id: customerInfo.userId,
          name: customerInfo.name,
          email: customerInfo.email,
        });

        // Add the new order to the new customer
        await customer.addOrder(newOrder);
      }
    }

    return new NextResponse("Order created", { status: 200 });
  } catch (err) {
    console.error("[webhooks_POST]", err);
    return new NextResponse("Failed to create the order", { status: 500 });
  }
};
