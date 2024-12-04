//app\api\wishlist\route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  addToWishlist,
  getUserById,
  removeFromWishlist,
  updateWishlist,
} from "@/lib/models/user";
import { auth } from "@/auth";

export const POST = async (req: NextRequest) => {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return new NextResponse("Product Id required", { status: 400 });
    }

    const userId = Number(session.user.id);
    const user = await getUserById(userId);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Ensure wishlist is always an array
    const userWishlist = Array.isArray(user.wishlist) ? user.wishlist : [];

    const isProductInWishlist = userWishlist.includes(productId);

    // Add or Remove product from wishlist
    const updatedWishlist = isProductInWishlist
      ? await removeFromWishlist(String(userId), productId)
      : await addToWishlist(userId, [...userWishlist, productId]);

    return NextResponse.json({ wishlist: updatedWishlist });
  } catch (err) {
    console.log("[wishlist_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
