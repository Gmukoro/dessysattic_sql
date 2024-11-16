// app/api/review/route.ts
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";
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
export const OPTIONS = async () => {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
};

// GET method to retrieve all reviews for a product
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    const reviewsQuery = `
      SELECT _id, name, content, rating, createdAt 
      FROM reviews 
      WHERE productId = ? 
      ORDER BY createdAt DESC;
    `;
    const reviewsResult = (await query({
      query: reviewsQuery,
      values: [productId],
    })) as RowDataPacket[];

    // Check if reviewsResult is an array and has entries
    if (!Array.isArray(reviewsResult) || reviewsResult.length === 0) {
      return new NextResponse("No reviews found for this product", {
        status: 404,
      });
    }

    const formattedReviews = reviewsResult.map((review) => ({
      ...review,
      createdAt: format(new Date(review.createdAt), "MMM do, yyyy"),
    }));

    return NextResponse.json(formattedReviews, { status: 200 });
  } catch (err) {
    console.error("[reviews_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// POST method to create a new review
export const POST = async (req: NextRequest) => {
  try {
    const { productId, content, rating, name, email } = await req.json();

    if (!productId || !content || !rating || !name || !email) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newReview = {
      _id: crypto.randomUUID(),
      productId,
      name,
      content,
      rating,
      email,
    };

    await reviewModel.createReview(newReview);

    return new NextResponse("Review created successfully", {
      status: 201,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("[reviews_POST]", err);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};

// DELETE method to delete a review by ID
export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const reviewId = searchParams.get("reviewId");

    if (!reviewId) {
      return new NextResponse("Review ID is required", { status: 400 });
    }

    await reviewModel.deleteReview(parseInt(reviewId));

    return new NextResponse("Review deleted successfully", {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("[reviews_DELETE]", err);
    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
};
