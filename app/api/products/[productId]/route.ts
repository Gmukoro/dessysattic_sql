import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductCollections,
} from "@/lib/models/Product";

// GET Product by ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const productId = parseInt(params.productId, 10); // Parse productId safely
    if (isNaN(productId)) {
      return new NextResponse("Invalid product ID", { status: 400 });
    }

    const product = await getProductById(productId);
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
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
export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const productId = parseInt(params.productId, 10);
    if (isNaN(productId)) {
      return new NextResponse("Invalid product ID", { status: 400 });
    }

    const updateData = await req.json();
    if (!updateData.title || !updateData.category || !updateData.price) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const updatedProduct = await updateProduct(productId, updateData);

    // Update associated collections
    if (updateData.collections) {
      await updateProductCollections(productId, updateData.collections);
    }

    return new NextResponse(JSON.stringify(updatedProduct), { status: 200 });
  } catch (err) {
    console.error("[productId_POST]", err);
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
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const productId = parseInt(params.productId, 10);
    if (isNaN(productId)) {
      return new NextResponse("Invalid product ID", { status: 400 });
    }

    await deleteProduct(productId);
    return new NextResponse("Product deleted successfully", { status: 200 });
  } catch (err) {
    console.error("[productId_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
