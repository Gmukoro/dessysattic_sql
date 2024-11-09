//app\api\collections\route.ts

import { NextRequest, NextResponse } from "next/server";
import Collection from "@/lib/models/Collection";
import { auth } from "@/auth";
import sequelize from "@/app/api/sequelize.config";

export const POST = async (req: NextRequest) => {
  try {
    await sequelize!.authenticate();

    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { title, description, image } = await req.json();

    const existingCollection = await Collection.findOne({ where: { title } });

    if (existingCollection) {
      return new NextResponse("Collection already exists", { status: 400 });
    }

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    const newCollection = await Collection.create({
      title,
      description,
      image,
    });

    await newCollection.save();

    return NextResponse.json(newCollection, { status: 200 });
  } catch (err) {
    console.log("[collections_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const collections = await Collection.findAll({
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json(collections, { status: 200 });
  } catch (err) {
    console.log("[collections_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
