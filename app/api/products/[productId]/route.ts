//app\api\products\[productId]\route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  fetchProductById,
  updateProduct,
  deleteProduct,
  createProduct,
} from "@/lib/models/Product";

// GET Product by ID
export const GET = async (
  req: NextRequest,
  context: { params: { productId: string } }
) => {
  try {
    // Await the params object to safely access properties
    const { productId } = await context.params;

    const id = parseInt(productId, 10);

    if (isNaN(id)) {
      return new NextResponse("Invalid product ID", { status: 400 });
    }

    // Extract query parameters using `searchParams`
    const url = new URL(req.url);
    const media = url.searchParams.get("media");

    let parsedMedia: string[] = [];
    if (media) {
      try {
        parsedMedia = JSON.parse(decodeURIComponent(media));
      } catch (error) {
        console.error("Error parsing media query parameter:", error);
        parsedMedia = [];
      }
    }

    // Fetch the product based on the productId
    const product = await fetchProductById(id);

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    console.log("Fetched product:", product);

    // Ensure media is properly set in the product object
    product.media = parsedMedia.length ? parsedMedia : product.media;

    // Return the product as a JSON response
    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.error("[productId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// POST: Update Product Information
export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    console.log("Session data:", session);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const productData = await req.json();
    if (!productData.title || !productData.media || !productData.price) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Update product in the database
    const updatedProduct = await updateProduct(productData.id, productData);

    return new NextResponse(JSON.stringify(updatedProduct), { status: 200 });
  } catch (err) {
    console.error("[updateProduct_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// DELETE: Remove Product
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const session = await auth();
    console.log("Session data:", session);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { productId } = params;
    const id = parseInt(productId, 10);
    if (isNaN(id)) {
      return new NextResponse("Invalid product ID", { status: 400 });
    }

    await deleteProduct(id);
    return new NextResponse("Product deleted successfully", { status: 200 });
  } catch (err) {
    console.error("[productId_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
