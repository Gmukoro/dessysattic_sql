//app\api\review\route.ts

// Import necessary models and utilities
import Product from "@/lib/models/Product";
import Review from "@/lib/models/reviews";
import sequelize from "@/app/api/sequelize.config";
import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": `*`,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// POST method for creating a new review
export const POST = async (req: NextRequest) => {
  await sequelize!.authenticate();

  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { productId, content, rating, name, email } = await req.json();

    if (!productId || !content || !rating || !name) {
      return new NextResponse("Insufficient data to create a review", {
        status: 400,
      });
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return new NextResponse("Rating must be a number between 1 and 5", {
        status: 400,
      });
    }

    // Find product by primary key using Sequelize
    const product = await Product.findByPk(productId);
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Check if the user has already reviewed this product
    const existingReview = await Review.findOne({
      where: { productId, email },
    });
    if (existingReview) {
      return new NextResponse("You have already reviewed this product", {
        status: 400,
      });
    }

    // Create a new review
    const newReview = await Review.create({
      productId,
      rating,
      comment: content,
      userId: name, // or an actual user ID if available
      email,
    });

    return new NextResponse(JSON.stringify(newReview), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("[POST Error]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// GET method to fetch reviews for a product
export const GET = async (req: NextRequest) => {
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Fetch reviews using Sequelize's `findAll` with filtering
    const reviews = await Review.findAll({
      where: { productId },
      order: [["createdAt", "DESC"]],
    });

    if (!reviews.length) {
      return new NextResponse("No reviews found for this product", {
        status: 404,
      });
    }

    // Return the reviews in the response
    return new NextResponse(JSON.stringify(reviews), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("[GET Error]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
