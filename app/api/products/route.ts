//app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createProduct,
  getAllProducts,
  addProductsToCollection,
  ProductAttributes,
} from "@/lib/models/Product";

// POST: Create a new product
export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const productData = await req.json();
    if (!productData) {
      return new NextResponse("Bad Request: Missing Product Data", {
        status: 400,
      });
    }

    const newProduct = await createProduct(productData);
    if (!newProduct) {
      return new NextResponse(
        "Internal Server Error: Product Creation Failed",
        { status: 500 }
      );
    }

    const typedProduct = newProduct as unknown as ProductAttributes;

    if (productData.collections && productData.collections.length > 0) {
      await Promise.all(
        productData.collections.map((collectionId: number) =>
          addProductsToCollection(typedProduct.id, [collectionId])
        )
      );
    }

    return NextResponse.json(typedProduct, { status: 201 });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// GET: Fetch all products
export const GET = async (req: NextRequest) => {
  try {
    const products = await getAllProducts();

    if (!products || products.length === 0) {
      console.log("[products_GET] No products found.");
      return new NextResponse(
        JSON.stringify({ message: "No Products Found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
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

    // Ensure media is properly set for all products and log media URLs
    products.forEach((product) => {
      product.media = parsedMedia.length ? parsedMedia : product.media || [""];
      console.log(
        `[products_GET] Media URLs for product (${product.id}):`,
        product.media
      );
    });

    console.log("[products_GET] Products fetched successfully", products);
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

export const dynamic = "force-dynamic";
