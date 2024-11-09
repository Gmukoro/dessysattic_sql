//app\api\reviews\route.ts

import Product from "@/lib/models/Product";
import Review from "@/lib/models/reviews";
import sequelize from "@/app/api/sequelize.config";
import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": `*`,
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const GET = async (req: NextRequest) => {
  await sequelize!.authenticate();

  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Fetch all reviews using Sequelize's findAll method
    const reviews = await Review.findAll();

    // Check if there are any reviews returned
    if (!reviews || reviews.length === 0) {
      return new NextResponse("No reviews found", {
        status: 404,
        headers: corsHeaders,
      });
    }

    // Send reviews in JSON format
    return NextResponse.json(reviews, { status: 200, headers: corsHeaders });
  } catch (err) {
    console.error("[reviews_GET]", err);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};
