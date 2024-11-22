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
      return new NextResponse("No Products Found", { status: 404 });
    }

    console.log("[products_GET] Products fetched successfully", products);
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
