//app\api\products\[productId]\route.ts

import { NextRequest, NextResponse } from "next/server";
import { Op } from "sequelize";
import { auth } from "@/auth";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";
import sequelize from "@/app/api/sequelize.config";

// Initialize the Sequelize connection.
await sequelize!.authenticate();

// Define associations
Product.belongsToMany(Collection, { through: "ProductCollections" });
Collection.belongsToMany(Product, { through: "ProductCollections" });

// GET Product by ID
export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const product = await Product.findOne({
      where: { id: params.productId },
      include: Collection,
    });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
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
    console.log("[productId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
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

    const product = await Product.findByPk(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
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

    // Update product details
    await product.update({
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

    // Update associated collections
    if (collections) {
      const associatedCollections = await Collection.findAll({
        where: { id: collections },
      });
      await product.setCollections(associatedCollections);
    }

    return new NextResponse(JSON.stringify(product), { status: 200 });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

// DELETE: Remove Product and Update Collections
export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const product = await Product.findByPk(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    // Delete the product
    await product.destroy();

    return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
