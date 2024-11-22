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

// GET: Retrieve all reviews
export const GET = async (req: NextRequest) => {
  try {
    const allReviews = await getAllReviews();

    // If no reviews found, return a 404 status
    if (!allReviews || allReviews.length === 0) {
      return new NextResponse("No reviews found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Return reviews as JSON response
    return NextResponse.json(allReviews, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("[GET All Reviews Error]", error);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};
