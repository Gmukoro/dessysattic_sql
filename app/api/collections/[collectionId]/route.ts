// app/api/collections/[collectionId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getCollectionById,
  updateCollection,
  deleteCollection,
} from "@/lib/models/Collection";

// Utility to validate session
const validateSession = async () => {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  return session;
};

// GET: Fetch collection details (no session required)
export const GET = async (
  req: NextRequest,
  context: { params: { collectionId: string } }
) => {
  try {
    const { params } = context;
    const collectionId = params.collectionId;

    const collection = await getCollectionById(collectionId);

    if (collection) {
      return NextResponse.json(collection, { status: 200 });
    }

    return new NextResponse("Collection not found", { status: 404 });
  } catch (err) {
    console.error("[collectionId_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// POST: Update collection (session required)
export const POST = async (
  req: NextRequest,
  context: { params: { collectionId: string } }
) => {
  try {
    const session = await validateSession();
    if (session instanceof NextResponse) {
      return session;
    }

    const { params } = context;
    const collectionId = params.collectionId;

    const collection = await getCollectionById(collectionId);
    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    const { title, description, image } = await req.json();
    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    const updatedCollection = await updateCollection(collection._id, {
      title,
      description,
      image,
    });

    if (updatedCollection) {
      return NextResponse.json(updatedCollection, { status: 200 });
    }

    return new NextResponse("Error updating collection", { status: 500 });
  } catch (err) {
    console.error("[collectionId_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// DELETE: Delete collection (session required)
export const DELETE = async (
  req: NextRequest,
  context: { params: { collectionId: string } }
) => {
  try {
    const session = await validateSession();
    if (session instanceof NextResponse) {
      return session; // Unauthorized response
    }

    const { params } = context;
    const collectionId = params.collectionId;

    const result = await deleteCollection(collectionId);

    if (result) {
      return new NextResponse("Collection deleted", { status: 200 });
    }

    return new NextResponse("Collection not found", { status: 404 });
  } catch (err) {
    console.error("[collectionId_DELETE]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
