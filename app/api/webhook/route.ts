import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import crypto from "crypto";
import { createOrder } from "@/lib/models/Order";
import { createCustomer, getCustomerById } from "@/lib/models/Customer";
import { query } from "@/lib/database";
import { auth } from "@/auth";

// Helper function to verify Paystack signature
const verifyPaystackSignature = (
  rawBody: string,
  signature: string,
  secret: string
) => {
  const hash = crypto
    .createHmac("sha512", secret)
    .update(rawBody)
    .digest("hex");
  return hash === signature;
};

export const POST = async (req: NextRequest) => {
  const session = await auth();
  console.log("Session data:", session);
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const rawBody = await req.text();
    const stripeSignature = req.headers.get("Stripe-Signature");
    const paystackSignature = req.headers.get("x-paystack-signature");

    if (stripeSignature) {
      // Stripe webhook processing
      const event = stripe.webhooks.constructEvent(
        rawBody,
        stripeSignature,
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
          {
            expand: ["line_items.data.price.product"],
          }
        );

        const lineItems = retrieveSession?.line_items?.data || [];
        const orderItems = lineItems.map((item: any) => ({
          product: item.price.product.metadata.productId || "",
          color: item.price.product.metadata.color || "N/A",
          size: item.price.product.metadata.size || "N/A",
          quantity: item.quantity || 1,
        }));

        const newOrder = {
          _id: session.id,
          products: orderItems,
          shippingAddress,
          shippingRate: parseInt(session?.shipping_cost?.shipping_rate || "0"),
          totalAmount: session.amount_total ? session.amount_total / 100 : 0,
          customerId: customerInfo.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        await createOrder(newOrder);
      }
    } else if (paystackSignature) {
      // Paystack webhook processing
      const isValid = verifyPaystackSignature(
        rawBody,
        paystackSignature,
        process.env.PAYSTACK_SECRET_KEY!
      );

      if (!isValid) {
        return new NextResponse("Invalid Paystack signature", { status: 401 });
      }

      const event = JSON.parse(rawBody);

      if (event.event === "charge.success") {
        const data = event.data;

        const customerInfo = {
          userId: data.metadata.userId || "",
          name: data.customer.name || "Unknown",
          email: data.customer.email || "",
        };

        const shippingAddress = data.metadata.shippingAddress || {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        };

        const orderItems = data.metadata.products || [];

        const session = event.data.object as any;

        const newOrder = {
          _id: session.id,
          products: orderItems,
          shippingAddress,
          shippingRate: parseInt(session?.shipping_cost?.shipping_rate || "0"),
          totalAmount: session.amount_total ? session.amount_total / 100 : 0,
          customerId: customerInfo.userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await createOrder(newOrder);
      }
    } else {
      return new NextResponse("Unsupported webhook provider", { status: 400 });
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (err) {
    console.error("[webhooks_POST]", err);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
};
