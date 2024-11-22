import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/models/Order";
import {
  createCustomer,
  getCustomerById,
  updateCustomer,
} from "@/lib/models/Customer";

// Define types for better clarity
interface ExchangeRateCache {
  value: number;
  lastUpdated: Date | null;
}

let cachedRate: ExchangeRateCache = {
  value: 0,
  lastUpdated: null,
};

// Fetch exchange rate and cache it in memory
async function fetchExchangeRate(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.currencyapi.com/v3/latest?apikey=cur_live_fKs6WT1tLchYGJ5hnzmQX4qLMzEHULKMsJtXrBWr&currencies=EUR%2CUSD%2CCAD%2CNGN%2CGBP&base_currency=EUR"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate. Please try again later.");
    }

    const data = await response.json();
    if (!data.data || !data.data.NGN) {
      throw new Error("Exchange rate for NGN is not available at the moment.");
    }

    const exchangeRate = data.data.NGN.value;

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

function calculateDeliveryFee(totalAmount: number): number {
  // Delivery fee logic based on the total amount
  return totalAmount < 15000 ? 500 : 0;
}

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function POST(req: NextRequest) {
  try {
    const { cartItems, customer, delivery } = await req.json();

    if (!cartItems || !customer) {
      return new NextResponse(
        "Not enough data to checkout. Please make sure all fields are filled.",
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Get the exchange rate (EUR to NGN)
    const exchangeRate = await getExchangeRate();

    // Calculate total amount in Euro
    const totalEuro = cartItems.reduce(
      (acc: number, item: { item: { price: number }; quantity: number }) =>
        acc + item.item.price * item.quantity,
      0
    );

    // Calculate delivery fee (in Euro cents)
    const deliveryFee = calculateDeliveryFee(totalEuro);

    // Convert to final total Euro (including delivery fee) in Euros
    const finalTotalEuro = totalEuro + deliveryFee / 100;

    // Convert to Naira (multiply by exchange rate and then by 100 for Kobo)
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
      // Proceed with order and customer creation
      const orderItems = cartItems.map((item: any) => ({
        product: item.item.id,
        color: item.color || "N/A",
        size: item.size || "N/A",
        quantity: item.quantity,
      }));

      const newOrderData = {
        id: "",
        products: orderItems,
        shippingAddress: delivery,
        shippingRate: deliveryFee.toString(),
        totalAmount: parseFloat(finalTotalEuro.toFixed(2)),
        createdAt: new Date(),
        updatedAt: new Date(),
        customerId: customer.id,
      };
      await createOrder(newOrderData);

      // Check if customer exists, create or update accordingly
      let existingCustomer = await getCustomerById(customer.id);

      if (!existingCustomer) {
        const newCustomerData = {
          userId: customer.id,
          name: customer.name,
          email: customer.email,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await createCustomer(newCustomerData);
      } else {
        await updateCustomer(customer.id, {
          email: customer.email,
          name: customer.name,
        });
      }

      return NextResponse.json(
        { url: session.data.authorization_url },
        { headers: corsHeaders }
      );
    } else {
      throw new Error("Unable to create Paystack session. Please try again.");
    }
  } catch (err) {
    console.error("[paystack_checkout_POST]", err);
    return new NextResponse(
      "We encountered an issue processing your payment. Please try again later.",
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// GET function for Payment Verification
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
      return new NextResponse("Verification failed. Please contact support.", {
        status: 400,
        headers: corsHeaders,
      });
    }
  } catch (err) {
    console.error("[paystack_checkout_GET]", err);
    return new NextResponse(
      "There was an issue verifying your payment. Please try again later.",
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
