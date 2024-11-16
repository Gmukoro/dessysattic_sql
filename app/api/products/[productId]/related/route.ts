import { NextRequest, NextResponse } from "next/server";
import { getProductById, getRelatedProducts } from "@/lib/models/Product";

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const productId = parseInt(params.productId, 10);
    if (isNaN(productId)) {
      return new NextResponse(
        JSON.stringify({ message: "Invalid product ID" }),
        { status: 400 }
      );
    }

    // Fetch product details by ID
    const product = await getProductById(productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    // Fetch related products based on the product's category
    const relatedProducts = await getRelatedProducts(product);

    if (relatedProducts.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No related products found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(relatedProducts, { status: 200 });
  } catch (error) {
    console.error("[GET related products]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
