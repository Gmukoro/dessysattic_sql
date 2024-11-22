import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
} from "@/lib/models/Product";

// GET Product by ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { productId } = params;
    const id = parseInt(productId, 10);
    if (isNaN(id)) {
      return new NextResponse("Invalid product ID", { status: 400 });
    }

    const product = await getProductById(id);
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
export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
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
