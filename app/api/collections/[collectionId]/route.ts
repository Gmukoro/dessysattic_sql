//app\api\collections\[collectionId]\route.ts

import { NextRequest, NextResponse } from "next/server";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { auth } from "@/auth";
import sequelize from "@/app/api/sequelize.config";

export const GET = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    await sequelize!.authenticate();
    const collection = await Collection.findByPk(params.collectionId, {
      include: [{ model: Product, as: "products" }],
    });

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    console.error("[collectionId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    let collection = await Collection.findByPk(params.collectionId);

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    const { title, description, image } = await req.json();

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    await collection.update({ title, description, image });
    return NextResponse.json(collection, { status: 200 });
  } catch (err) {
    console.error("[collectionId_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const collection = await Collection.findByPk(params.collectionId);

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    await collection.destroy();
    return new NextResponse("Collection deleted", { status: 200 });
  } catch (err) {
    console.error("[collectionId_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
