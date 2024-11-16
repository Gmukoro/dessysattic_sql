import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createCustomer, getCustomerById } from "@/lib/models/Customer";
import { createOrder } from "@/lib/models/Order";
import { query } from "@/lib/database";

// Webhook POST handler
export const POST = async (req: NextRequest) => {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("Stripe-Signature") || "";

    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const customerInfo = {
        userId: session?.client_reference_id || "",
        name: session?.customer_details?.name || "Unknown",
        email: session?.customer_details?.email || "",
      };

      const shippingAddress = {
        street: session?.shipping_details?.address?.line1 || "",
        city: session?.shipping_details?.address?.city || "",
        state: session?.shipping_details?.address?.state || "",
        postalCode: session?.shipping_details?.address?.postal_code || "",
        country: session?.shipping_details?.address?.country || "",
      };

      const retrieveSession = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items.data.price.product"] }
      );

      const lineItems = retrieveSession?.line_items?.data || [];

      const orderItems = lineItems.map((item: any) => ({
        product: item.price.product.metadata.productId || "",
        color: item.price.product.metadata.color || "N/A",
        size: item.price.product.metadata.size || "N/A",
        quantity: item.quantity || 1,
      }));

      // Insert the order into the database
      const newOrder = {
        _id: session.id,
        products: orderItems,
        shippingAddress,
        shippingRate: session?.shipping_cost?.shipping_rate || "Standard",
        totalAmount: session.amount_total ? session.amount_total / 100 : 0,
        customerId: customerInfo.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await createOrder(newOrder);

      let customer = await getCustomerById(customerInfo.userId);

      if (customer) {
        // Add the new order to the existing customer
        await query({
          query: `INSERT INTO orders (customerId, order_id) VALUES (?, ?);`,
          values: [customerInfo.userId, newOrder._id],
        });
      } else {
        // If customer does not exist, create a new customer
        await createCustomer({
          userId: customerInfo.userId,
          name: customerInfo.name,
          email: customerInfo.email,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        await query({
          query: `INSERT INTO orders (customerId, order_id) VALUES (?, ?);`,
          values: [customerInfo.userId, newOrder._id],
        });
      }
    }

    return new NextResponse("Order created", { status: 200 });
  } catch (err) {
    console.error("[webhooks_POST]", err);
    return new NextResponse("Failed to create the order", { status: 500 });
  }
};
