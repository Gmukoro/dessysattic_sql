// import { NextRequest, NextResponse } from "next/server";
// import {
//   createCustomer,
//   getCustomerById,
//   updateCustomer,
// } from "@/lib/models/Customer";
// import { createOrder } from "@/lib/models/Order";

// const PAYPAL_API_BASE = "https://api-m.sandbox.paypal.com";
// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// } as const;

// // In-memory cache for storing the token and expiration
// let cachedToken: string | null = null;
// let tokenExpiration: number | null = null;

// // Function to generate a PayPal token with caching and error handling
// async function generatePayPalToken(): Promise<string | null> {
//   // Check if we have a valid cached token
//   if (cachedToken && tokenExpiration && Date.now() < tokenExpiration) {
//     return cachedToken;
//   }

//   try {
//     const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
//       method: "POST",
//       headers: {
//         Authorization: `Basic ${Buffer.from(
//           `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
//         ).toString("base64")}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: "grant_type=client_credentials",
//     });

//     if (!response.ok) {
//       throw new Error("Failed to get PayPal token");
//     }

//     const data = await response.json();
//     cachedToken = data.access_token;
//     tokenExpiration = Date.now() + data.expires_in * 1000;

//     return cachedToken;
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error("Error generating PayPal token:", error.message);
//     } else {
//       console.error("An unknown error occurred during PayPal token generation");
//     }
//     return null;
//   }
// }

// function calculateDeliveryFee(totalAmount: number): number {
//   return totalAmount < 15000 ? 500 : 0;
// }

// // POST request: Initiate PayPal order
// export async function POST(req: NextRequest) {
//   try {
//     const { cartItems, customer, delivery } = await req.json();

//     if (!cartItems || !customer) {
//       return new NextResponse("Not enough data to checkout", {
//         status: 400,
//         headers: corsHeaders,
//       });
//     }

//     const totalEuro = cartItems.reduce(
//       (acc: number, item: { item: { price: number }; quantity: number }) =>
//         acc + item.item.price * item.quantity,
//       0
//     );

//     const deliveryFee = calculateDeliveryFee(totalEuro);
//     const finalTotalEuro = (totalEuro + deliveryFee) / 100;

//     const token =
//       process.env.PAYPAL_ACCESS_TOKEN || (await generatePayPalToken());
//     if (!token) {
//       return new NextResponse("Unable to generate PayPal token", {
//         status: 500,
//         headers: corsHeaders,
//       });
//     }

//     const payPalOrder = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
//       method: "POST",
//       headers: {
//         ...corsHeaders,
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         intent: "CAPTURE",
//         purchase_units: [
//           {
//             amount: {
//               currency_code: "EUR",
//               value: finalTotalEuro.toFixed(2),
//             },
//             description: "Order from E-commerce Store",
//           },
//         ],
//         application_context: {
//           return_url: `/payment_success`,
//           cancel_url: `/cart`,
//         },
//       }),
//     });

//     const order = await payPalOrder.json();

//     if (order.status === "CREATED") {
//       const orderItems = cartItems.map((item: any) => ({
//         product: item.item._id,
//         color: item.color || "N/A",
//         size: item.size || "N/A",
//         quantity: item.quantity,
//       }));

//       const newOrderData = {
//         products: orderItems,
//         shippingAddress: delivery,
//         shippingRate: deliveryFee,
//         totalAmount: finalTotalEuro,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         customerId: customer.id,
//       };

//       await createOrder(newOrderData);

//       let existingCustomer = await getCustomerById(customer.customerId);

//       if (!existingCustomer) {
//         const newCustomerData = {
//           userId: customer.id,
//           name: customer.name,
//           email: customer.email,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         };
//         await createCustomer(newCustomerData);
//       } else {
//         await updateCustomer(customer.customerId, {
//           email: customer.email,
//           name: customer.name,
//         });
//       }

//       return NextResponse.json(
//         {
//           url: order.links.find((link: any) => link.rel === "approve").href,
//         },
//         { headers: corsHeaders }
//       );
//     } else {
//       return new NextResponse("Unable to create PayPal order", {
//         status: 500,
//         headers: corsHeaders,
//       });
//     }
//   } catch (err: unknown) {
//     console.error("[paypal_checkout_POST]", err);
//     return new NextResponse("Internal Server Error", {
//       status: 500,
//       headers: corsHeaders,
//     });
//   }
// }
