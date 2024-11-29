import { NextRequest, NextResponse } from "next/server";

let cachedRate: { value: number; lastUpdated: Date | null } = {
  value: 0,
  lastUpdated: null,
};

// Fetch exchange rate and cache it in memory
async function fetchExchangeRate() {
  const response = await fetch(
    "https://api.currencyapi.com/v3/latest?apikey=cur_live_2S4O6nmXuCkF7WSWbSb67cxQSx4wDevnevfW8p2g&currencies=EUR%2CUSD%2CCAD%2CNGN%2CGBP"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch exchange rate");
  }

  const data = await response.json();
  if (!data.data || !data.data.NGN) {
    throw new Error("Exchange rate for NGN is not available");
  }

  const exchangeRate = data.data.NGN.value;

  // Cache the exchange rate and the last updated time in memory
  cachedRate = {
    value: exchangeRate,
    lastUpdated: new Date(),
  };

  return exchangeRate;
}

async function getExchangeRate() {
  // Check if we have a recent exchange rate in memory
  if (
    cachedRate.lastUpdated &&
    new Date().getTime() - cachedRate.lastUpdated.getTime() <
      7 * 24 * 60 * 60 * 1000
  ) {
    return cachedRate.value;
  }

  // Fetch a new rate if none is cached or it's older than 7 days
  return await fetchExchangeRate();
}

function calculateDeliveryFee(totalAmount: number): number {
  return totalAmount < 15000 ? 500 : 0;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer, delivery } = await req.json();

    if (!cartItems || !customer) {
      return new NextResponse("Not enough data to checkout", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Get the exchange rate (EUR to NGN)
    const exchangeRate = await getExchangeRate();

    // Calculate total amount in Euro
    const totalEuro = cartItems.reduce(
      (acc: number, item: { item: { price: number }; quantity: number }) =>
        acc + item.item.price * item.quantity,
      0
    );

    const deliveryFee = calculateDeliveryFee(totalEuro);
    const finalTotalEuro = totalEuro + deliveryFee / 100;
    const amountInNaira = Math.round(finalTotalEuro * exchangeRate * 100);

    const paystackSession = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          ...corsHeaders,
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customer.email,
          amount: amountInNaira,
          currency: "NGN",
          callback_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
          cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
          metadata: {
            client_reference_id: customer.id,
            cartItems: cartItems.map(
              (item: { item: { _id: any } }) => item.item._id
            ),
          },
        }),
      }
    );

    const session = await paystackSession.json();

    if (session.status) {
      return NextResponse.json(
        { url: session.data.authorization_url },
        { headers: corsHeaders }
      );
    } else {
      return new NextResponse("Unable to create Paystack session", {
        status: 500,
        headers: corsHeaders,
      });
    }
  } catch (err) {
    console.log("[paystack_checkout_POST]", err);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// GET function remains unchanged
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");

  try {
    const verificationResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const verificationData = await verificationResponse.json();

    if (verificationData.status) {
      return NextResponse.json(verificationData.data, { headers: corsHeaders });
    } else {
      return new NextResponse("Verification failed", {
        status: 400,
        headers: corsHeaders,
      });
    }
  } catch (err) {
    console.log("[paystack_checkout_GET]", err);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// import { NextRequest, NextResponse } from "next/server";

// // Function to calculate delivery fee in Naira
// function calculateDeliveryFee(totalAmountInNaira: number): number {
//   console.log("Total amount in Naira before delivery fee:", totalAmountInNaira);
//   // If total is less than 200,000 Naira, delivery fee is 10,000 Naira, otherwise 0
//   return totalAmountInNaira < 200000 ? 10000 : 0;
// }

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// export async function POST(req: NextRequest) {
//   try {
//     const { cartItems, customer, delivery } = await req.json();

//     if (!cartItems || !customer) {
//       return new NextResponse("Not enough data to checkout", {
//         status: 400,
//         headers: corsHeaders,
//       });
//     }

//     // Debugging: log cartItems to ensure prices and quantities are correct
//     console.log("Cart Items:", cartItems);

//     // Calculate total amount in Naira
//     const totalAmountInNaira = cartItems.reduce(
//       (acc: number, item: { item: { price: number }; quantity: number }) => {
//         const itemTotal = item.item.price * item.quantity;
//         console.log(
//           `Item price: ${item.item.price}, Quantity: ${item.quantity}, Total for item: ${itemTotal}`
//         );
//         return acc + itemTotal;
//       },
//       0
//     );

//     // Debugging: log total amount in Naira
//     console.log("Total amount in Naira:", totalAmountInNaira);

//     // Calculate the delivery fee in Naira
//     const deliveryFeeInNaira = calculateDeliveryFee(totalAmountInNaira);

//     // Debugging: log delivery fee in Naira
//     console.log("Delivery Fee in Naira:", deliveryFeeInNaira);

//     // Final total in Naira (including delivery fee)
//     const finalTotalInNaira = totalAmountInNaira + deliveryFeeInNaira;

//     // Debugging: log final total in Naira
//     console.log(
//       "Final Total in Naira (including delivery):",
//       finalTotalInNaira
//     );

//     // Convert the final total amount into Kobo (1 Naira = 100 Kobo)
//     const finalTotalInKobo = finalTotalInNaira * 100;

//     // Debugging: log final total in Kobo
//     console.log("Final Total in Kobo:", finalTotalInKobo);

//     // Initialize Paystack session
//     const paystackSession = await fetch(
//       "https://api.paystack.co/transaction/initialize",
//       {
//         method: "POST",
//         headers: {
//           ...corsHeaders,
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: customer.email,
//           amount: finalTotalInKobo,
//           currency: "NGN",
//           callback_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
//           cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
//           metadata: {
//             client_reference_id: customer.id,
//             cartItems: cartItems.map(
//               (item: { item: { _id: any } }) => item.item._id
//             ),
//           },
//         }),
//       }
//     );

//     const session = await paystackSession.json();

//     if (session.status) {
//       return NextResponse.json(
//         { url: session.data.authorization_url },
//         { headers: corsHeaders }
//       );
//     } else {
//       return new NextResponse("Unable to create Paystack session", {
//         status: 500,
//         headers: corsHeaders,
//       });
//     }
//   } catch (err) {
//     console.log("[paystack_checkout_POST]", err);
//     return new NextResponse("Internal Server Error", {
//       status: 500,
//       headers: corsHeaders,
//     });
//   }
// }

// // GET function remains unchanged
// export async function GET(req: NextRequest) {
//   const { searchParams } = new URL(req.url);
//   const reference = searchParams.get("reference");

//   try {
//     const verificationResponse = await fetch(
//       `https://api.paystack.co/transaction/verify/${reference}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const verificationData = await verificationResponse.json();

//     if (verificationData.status) {
//       return NextResponse.json(verificationData.data, { headers: corsHeaders });
//     } else {
//       return new NextResponse("Verification failed", {
//         status: 400,
//         headers: corsHeaders,
//       });
//     }
//   } catch (err) {
//     console.log("[paystack_checkout_GET]", err);
//     return new NextResponse("Internal Server Error", {
//       status: 500,
//       headers: corsHeaders,
//     });
//   }
// }
