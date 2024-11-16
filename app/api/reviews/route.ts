// app/api/reviews/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getAllReviews } from "@/lib/models/reviews";

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle CORS Preflight Requests
export const OPTIONS = async () => {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
};

export const GET = async (req: NextRequest) => {
  try {
    // Fetch all reviews using the model function
    const allReviews = await getAllReviews();

    if (!allReviews || allReviews.length === 0) {
      return new NextResponse("No reviews found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Return the reviews in JSON format
    return NextResponse.json(allReviews, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("[reviews_GET]", err);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};
