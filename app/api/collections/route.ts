// app/api/collections/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createCollection,
  getAllCollections,
  getCollectionById,
} from "../../../lib/models/Collection";

// Create a new collection
export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const { title, description, image } = await req.json();

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    // Check if collection already exists
    const existingCollection = await getCollectionById(title);

    if (existingCollection) {
      return new NextResponse("Collection already exists", { status: 400 });
    }

    // Create the collection using the model
    const result = await createCollection({
      title,
      description,
      image,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    console.log("[collections_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// Fetch all collections
export const GET = async (req: NextRequest) => {
  try {
    // Fetch collections using the model
    const collections = await getAllCollections();

    if (collections.length === 0) {
      return new NextResponse("No collections found", { status: 404 });
    }

    return NextResponse.json(collections, { status: 200 });
  } catch (err) {
    console.log("[collections_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
