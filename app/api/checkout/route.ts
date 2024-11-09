import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

function calculateShippingCost(totalAmount: number): number {
  return totalAmount < 15000 ? 500 : 0;
}

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer, delivery } = await req.json();

    if (!cartItems || !customer) {
      return new NextResponse("Not enough data to checkout", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Calculate total amount in cents
    const totalAmount = cartItems.reduce((total: number, cartItem: any) => {
      return total + Math.round(cartItem.item.price * 100) * cartItem.quantity;
    }, 0);

    const shippingCost = calculateShippingCost(totalAmount);

    const lineItems = [
      ...cartItems.map((cartItem: any) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: cartItem.item.title,
            metadata: {
              productId: cartItem.item._id,
              ...(cartItem.size && { size: cartItem.size }),
              ...(cartItem.color && { color: cartItem.color }),
            },
          },
          unit_amount: Math.round(cartItem.item.price * 100),
        },
        quantity: cartItem.quantity,
      })),
      ...(shippingCost > 0
        ? [
            {
              price_data: {
                currency: "eur",
                product_data: {
                  name: "Shipping",
                  description: "Standard shipping",
                },
                unit_amount: shippingCost,
              },
              quantity: 1,
            },
          ]
        : []),
    ];

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: [
          "US",
          "CA",
          "GB",
          "FR",
          "ES",
          "DE",
          "BE",
          "AT",
          "PT",
          "AU",
        ],
      },
      line_items: lineItems,
      automatic_tax: {
        enabled: true,
      },
      client_reference_id: customer.id,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
    });

    return NextResponse.json(checkoutSession, { headers: corsHeaders });
  } catch (err) {
    console.error("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export const dynamic = "force-dynamic";
