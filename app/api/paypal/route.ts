//app\api\paypal\route.ts

import { NextRequest, NextResponse } from "next/server";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import sequelize from "@/app/api/sequelize.config";

const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com";

async function generatePayPalToken(): Promise<string> {
  await sequelize!.authenticate();

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

function calculateDeliveryFee(totalAmount: number): number {
  return totalAmount < 15000 ? 500 : 0;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
} as const;

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer, delivery } = await req.json();

    if (!cartItems || !customer) {
      return new NextResponse("Not enough data to checkout", { status: 400 });
    }
    {
      return new NextResponse("Not enough data to checkout", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const totalEuro = cartItems.reduce(
      (acc: number, item: { item: { price: number }; quantity: number }) =>
        acc + item.item.price * item.quantity,
      0
    );

    const deliveryFee = calculateDeliveryFee(totalEuro);
    const finalTotalEuro = totalEuro + deliveryFee / 100;

    const token =
      process.env.PAYPAL_ACCESS_TOKEN || (await generatePayPalToken());

    const payPalOrder = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        ...corsHeaders,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: finalTotalEuro.toFixed(2),
            },
            description: "Order from E-commerce Store",
          },
        ],
        application_context: {
          return_url: `/payment_success`,
          cancel_url: `/cart`,
        },
      }),
    });

    const order = await payPalOrder.json();

    if (order.status === "CREATED") {
      const orderItems = cartItems.map((item: any) => ({
        product: item.item._id,
        color: item.color || "N/A",
        size: item.size || "N/A",
        quantity: item.quantity,
      }));

      const newOrder = new Order({
        customerUserId: customer.customerId,
        products: orderItems,
        shippingAddress: delivery,
        shippingRate: deliveryFee,
        totalAmount: finalTotalEuro,
      });

      await newOrder.save();

      let existingCustomer = await Customer.findOne({
        where: { id: customer.customerId },
      });

      if (existingCustomer) {
        existingCustomer?.orders.push(newOrder.id);
      } else {
        existingCustomer = new Customer({
          id: customer.customerId,
          name: customer.name,
          email: customer.email,
          orders: [newOrder.id],
        });
      }

      await existingCustomer?.save();

      return NextResponse.json(
        {
          url: order.links.find((link: any) => link.rel === "approve").href,
        },
        { headers: corsHeaders }
      );
    } else {
      return new NextResponse("Unable to create PayPal order", {
        status: 500,
        headers: corsHeaders,
      });
    }
  } catch (err) {
    console.log("[paypal_checkout_POST]", err);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  try {
    const accessToken =
      process.env.PAYPAL_ACCESS_TOKEN || (await generatePayPalToken());

    const verificationResponse = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${token}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verificationData = await verificationResponse.json();

    if (verificationData.status === "COMPLETED") {
      return NextResponse.json(verificationData, { headers: corsHeaders });
    } else {
      return new NextResponse("Verification failed", {
        status: 400,
        headers: corsHeaders,
      });
    }
  } catch (err) {
    console.log("[paypal_checkout_GET]", err);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}
