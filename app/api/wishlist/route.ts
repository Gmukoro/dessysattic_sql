//app\api\wishlist\route.ts

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  addToWishlist,
  removeFromWishlist,
  getUserById,
} from "@/lib/models/user";

export const POST = async (req: NextRequest) => {
  try {
    // Check if the user is authenticated
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Fetch user wishlist to check if product exists in wishlist
    const user = await getUserById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isLiked = user.wishlist.includes(productId);
    const updatedWishlist = isLiked
      ? await removeFromWishlist(session.user.id, productId)
      : await addToWishlist(session.user.id, productId);

    return NextResponse.json({ wishlist: updatedWishlist }, { status: 200 });
  } catch (err) {
    console.error("[wishlist_POST]", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
