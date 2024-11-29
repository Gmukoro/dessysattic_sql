import { NextRequest, NextResponse } from "next/server";
import { fetchProductById, fetchRelatedProducts } from "@/lib/models/Product";

export const GET = async (
  req: NextRequest,
  context: { params: { productId: string } }
) => {
  try {
    const { productId } = await context.params;

    const id = parseInt(productId, 10);

    if (isNaN(id)) {
      return new NextResponse("Invalid product ID", { status: 400 });
    }

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
    // Fetch product details by ID
    const product = await fetchProductById(id);
    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Fetch related products based on the product's ID (not the entire product object)
    const relatedProducts = await fetchRelatedProducts(id);

    product.media = parsedMedia.length ? parsedMedia : product.media;

    if (relatedProducts.length === 0) {
      return new NextResponse(JSON.stringify(product), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    return NextResponse.json(relatedProducts, { status: 200 });
  } catch (error) {
    console.error("[GET related products]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
