//app/api/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  // createProduct,
  getAllProducts,
  addProductsToCollection,
  ProductAttributes,
} from "@/lib/models/Product";
import { query } from "@/lib/database";
import { RowDataPacket } from "mysql2";

// POST: Create a new product

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const {
      title,
      description,
      media,
      category,
      collections,
      tags,
      sizes,
      colors,
      price,
      expense,
    } = await req.json();

    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create a product", {
        status: 400,
      });
    }

    // Insert product into the database
    const result = await query({
      query:
        "INSERT INTO products (title, description, media, category, price, expense) VALUES (?, ?, ?, ?, ?, ?)",
      values: [title, description, media, category, price, expense],
    });

    // Type assertion to indicate result is an array of RowDataPacket
    const insertId = (result as RowDataPacket[])[0]?.insertId;

    if (!insertId) {
      return new NextResponse("Failed to insert product", { status: 500 });
    }

    // Associate product with collections
    if (collections && collections.length > 0) {
      for (const collectionId of collections) {
        await query({
          query:
            "INSERT INTO collection_products (collection_id, product_id) VALUES (?, ?)",
          values: [collectionId, insertId],
        });
      }
    }

    return new NextResponse("Product created successfully", { status: 201 });
  } catch (err) {
    console.error("Error during product creation:", err);
    return new NextResponse("An unexpected error occurred", { status: 500 });
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
      // console.log(
      //   `[products_GET] Media URLs for product (${product.id}):`,
      //   product.media
      // );
    });

    // console.log("[products_GET] Products fetched successfully", products);
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
