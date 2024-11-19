import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import {
  addToWishlist,
  removeFromWishlist,
  getUserByEmail,
  UserAttributes,
  getUserById,
} from "@/lib/models/user";

// Format user data to maintain consistent structure
const formatUser = (user: any): UserAttributes => ({
  ...user,
  avatar: JSON.parse(user.avatar || "{}"),
  wishlist: user.wishlist ? JSON.parse(user.wishlist) : [],
});

export const POST = async (req: NextRequest) => {
  try {
    // Check if the user is authenticated
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
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
    const user = await getUserByEmail(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isLiked =
      Array.isArray(user.wishlist) && user.wishlist.includes(productId);
    const updatedWishlist = isLiked
      ? await removeFromWishlist(session.user.email, productId)
      : await addToWishlist(session.user.email, productId);

    // Return the formatted updated user data
    const updatedUser = formatUser({
      ...user,
      wishlist: updatedWishlist,
    });

    return NextResponse.json(
      { wishlist: updatedUser.wishlist },
      { status: 200 }
    );
  } catch (err) {
    console.error("[wishlist_POST]", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
