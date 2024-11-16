//app\api\products\route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createProduct,
  getAllProducts,
  addProductToCollection,
} from "@/lib/models/Product";

// POST: Create a new product
export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const productData = await req.json();
    const newProduct = await createProduct(productData);

    if (productData.collections && productData.collections.length > 0) {
      await Promise.all(
        productData.collections.map((collectionId: number) =>
          addProductToCollection(newProduct.id, collectionId)
        )
      );
    }

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// GET: Fetch all products
export const GET = async () => {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
