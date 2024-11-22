import { NextRequest, NextResponse } from "next/server";
import { getReviewsByEmail, getReviewsByProductId } from "@/lib/models/reviews";
import reviewModel from "@/lib/models/reviews";
import { query } from "@/lib/database";
import { RowDataPacket } from "mysql2";

// CORS Headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle OPTIONS Preflight Request
export const OPTIONS = async () =>
  new NextResponse(null, { status: 204, headers: corsHeaders });

// GET: Retrieve reviews for a product
export const GET = async (req: NextRequest) => {
  try {
    const productId = req.nextUrl.searchParams.get("productId");

    if (!productId) throw new Error("Product ID is required");

    const reviews = await getReviewsByProductId(productId);
    return new NextResponse(JSON.stringify(reviews), { status: 200 });
  } catch (error) {
    console.error("[GET Review Error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// POST: Create a new review
export const POST = async (req: NextRequest) => {
  try {
    const { productId, content, rating, name, email } = await req.json();

    // Ensure all fields are provided
    if (!productId || !content || !rating || !name || !email) {
      return new NextResponse("All fields are required", { status: 400 });
    }

    // Check if the product exists
    const reviews = await getReviewsByProductId(productId);
    if (!reviews) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Check if the user has already reviewed the product
    const existingReviews = await getReviewsByEmail(email);

    // Ensure `existingReviews` is an array
    if (Array.isArray(existingReviews)) {
      const hasReviewed = existingReviews.some(
        (review: { productId: string }) => review.productId === productId
      );

      if (hasReviewed) {
        return new NextResponse("You have already reviewed this product", {
          status: 400,
        });
      }
    }

    // Create a new review
    const newReview = {
      name,
      content,
      rating,
      email,
      productId,
    };

    await reviewModel.createReview(newReview);

    return new NextResponse("Review created successfully", {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("[POST Review Error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// DELETE: Delete a review by ID
export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return new NextResponse("Review ID is required", { status: 400 });
    }

    await reviewModel.deleteReview(parseInt(reviewId, 10));

    return new NextResponse("Review deleted successfully", {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("[DELETE Review Error]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
