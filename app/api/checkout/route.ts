// import { NextRequest, NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function OPTIONS() {
//   return NextResponse.json({}, { headers: corsHeaders });
// }

// function calculateShippingCost(totalAmount: number): number {
//   return totalAmount < 15000 ? 500 : 0;
// }

// export async function POST(req: NextRequest) {
//   try {
//     const { cartItems, customer, delivery } = await req.json();

//     if (!cartItems || !customer) {
//       return new NextResponse("Not enough data to checkout", {
//         status: 400,
//         headers: corsHeaders,
//       });
//     }

//     // Calculate total amount in cents
//     const totalAmount = cartItems.reduce((total: number, cartItem: any) => {
//       return total + Math.round(cartItem.item.price * 100) * cartItem.quantity;
//     }, 0);

//     const shippingCost = calculateShippingCost(totalAmount);

//     const lineItems = [
//       ...cartItems.map((cartItem: any) => ({
//         price_data: {
//           currency: "eur",
//           product_data: {
//             name: cartItem.item.title,
//             metadata: {
//               productId: cartItem.item._id,
//               ...(cartItem.size && { size: cartItem.size }),
//               ...(cartItem.color && { color: cartItem.color }),
//             },
//           },
//           unit_amount: Math.round(cartItem.item.price * 100),
//         },
//         quantity: cartItem.quantity,
//       })),
//       ...(shippingCost > 0
//         ? [
//             {
//               price_data: {
//                 currency: "eur",
//                 product_data: {
//                   name: "Shipping",
//                   description: "Standard shipping",
//                 },
//                 unit_amount: shippingCost,
//               },
//               quantity: 1,
//             },
//           ]
//         : []),
//     ];

//     const checkoutSession = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       shipping_address_collection: {
//         allowed_countries: [
//           "US",
//           "CA",
//           "GB",
//           "FR",
//           "ES",
//           "DE",
//           "BE",
//           "AT",
//           "PT",
//           "AU",
//         ],
//       },
//       line_items: lineItems,
//       automatic_tax: {
//         enabled: true,
//       },
//       client_reference_id: customer.id,
//       success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
//       cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
//     });

//     return NextResponse.json(checkoutSession, { headers: corsHeaders });
//   } catch (err) {
//     console.error("[checkout_POST]", err);
//     return new NextResponse("Internal Server Error", {
//       status: 500,
//       headers: corsHeaders,
//     });
//   }
// }

// export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Caching the exchange rate
let cachedRate: { value: number; lastUpdated: Date } = {
  value: 0,
  lastUpdated: new Date(0),
};

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

async function fetchExchangeRate(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.currencyapi.com/v3/latest?apikey=cur_live_fKs6WT1tLchYGJ5hnzmQX4qLMzEHULKMsJtXrBWr&currencies=EUR%2CUSD%2CCAD%2CNGN%2CGBP&base_currency=EUR"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate. Please try again later.");
    }

    const data = await response.json();
    if (!data.data || !data.data.USD) {
      throw new Error("Exchange rate for USD is not available at the moment.");
    }

    const exchangeRate = data.data.USD.value;

    // Cache the exchange rate and the last updated time in memory
    cachedRate = {
      value: exchangeRate,
      lastUpdated: new Date(),
    };

    return exchangeRate;
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw new Error(
      "We encountered an issue fetching the exchange rate. Please try again later."
    );
  }
}

async function getExchangeRate(): Promise<number> {
  const now = new Date();

  // Check if we have a recent exchange rate in memory
  if (
    cachedRate.lastUpdated &&
    now.getTime() - cachedRate.lastUpdated.getTime() < 7 * 24 * 60 * 60 * 1000
  ) {
    return cachedRate.value;
  }

  // Fetch a new rate if none is cached or it's older than 7 days
  return await fetchExchangeRate();
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

    // Get the exchange rate for USD to EUR
    const exchangeRate = await getExchangeRate();

    // Calculate total amount in cents (USD)
    const totalAmount = cartItems.reduce((total: number, cartItem: any) => {
      return total + Math.round(cartItem.item.price * 100) * cartItem.quantity;
    }, 0);

    const shippingCost = calculateShippingCost(totalAmount);

    // Convert the amount to EUR
    const totalAmountEUR = Math.round((totalAmount * exchangeRate) / 100); // Convert USD cents to EUR cents

    const lineItems = [
      ...cartItems.map((cartItem: any) => {
        const itemPriceEUR = Math.round(
          cartItem.item.price * exchangeRate * 100
        ); // Convert price to EUR
        return {
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
            unit_amount: itemPriceEUR, // Use converted EUR price
          },
          quantity: cartItem.quantity,
        };
      }),
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
