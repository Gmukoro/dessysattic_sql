import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import Collection, {
  getCollectionById,
  updateCollection,
  deleteCollection,
  getProductsInCollection,
} from "@/lib/models/Collection";
import Product, { getProductsByCollectionId } from "@/lib/models/Product";

// Utility to validate session
const validateSession = async () => {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  return session;
};

// GET: Fetch collection details (no session required)
export async function GET(
  req: Request,
  context: { params: { collectionId: string } }
) {
  try {
    // Ensure params are awaited before accessing
    const { collectionId } = context.params;

    // Validate and parse the collectionId
    const collectionIdInt = parseInt(collectionId, 10);
    if (isNaN(collectionIdInt)) {
      return new Response("Invalid collection ID", { status: 400 });
    }

    // Fetch collection details
    const collection = await Collection.getProductsInCollection(
      collectionIdInt
    );

    if (!collection) {
      return new Response("Collection details not found", { status: 404 });
    }

    return new Response(JSON.stringify(collection), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}

// POST: Update collection (session required)
export const POST = async (
  req: Request,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const session = await validateSession();
    if (session instanceof NextResponse) {
      return session;
    }

    const collectionId = parseInt(params.collectionId, 10);
    if (isNaN(collectionId)) {
      return new NextResponse("Invalid collection ID", { status: 400 });
    }

    let collection = await Collection.getCollectionById(collectionId);

    if (!collection) {
      return new NextResponse("Collection not found", { status: 404 });
    }

    const { title, description, image } = await req.json();
    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    const updatedCollection = await updateCollection(params.collectionId, {
      title,
      description,
      image,
    });

    if (updatedCollection) {
      return new NextResponse(JSON.stringify(updatedCollection), {
        status: 200,
      });
    }

    return new NextResponse("Error updating collection", { status: 500 });
  } catch (err) {
    console.error("[collectionId_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

// DELETE: Delete collection (session required)
export const DELETE = async (
  req: Request,
  { params }: { params: { collectionId: string } }
) => {
  try {
    const session = await validateSession();
    if (session instanceof NextResponse) {
      return session;
    }

    const collectionId = parseInt(params.collectionId, 10);
    if (isNaN(collectionId)) {
      return new NextResponse("Invalid collection ID", { status: 400 });
    }

    const result = await deleteCollection(params.collectionId);

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
