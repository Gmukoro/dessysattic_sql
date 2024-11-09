//app\api\products\route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";
import sequelize from "@/app/api/sequelize.config";

// Connect to the database
await sequelize!.authenticate();

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

    const newProduct = await Product.create({
      title,
      description,
      media,
      category,
      tags,
      sizes,
      colors,
      price,
      expense,
    });

    // Add associated collections
    if (collections && collections.length > 0) {
      const associatedCollections = await Collection.findAll({
        where: { id: collections },
      });
      await newProduct.setCollections(associatedCollections);
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

// GET: Fetch all products
export const GET = async () => {
  try {
    const products = await Product.findAll({
      order: [["createdAt", "DESC"]],
      include: Collection, // Includes collections in the product data
    });

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
