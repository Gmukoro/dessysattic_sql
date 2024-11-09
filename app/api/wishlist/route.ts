//app\api\wishlist\route.ts

import { auth } from "@/auth";
import User from "@/lib/models/user";
import sequelize from "@/app/api/sequelize.config";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await sequelize!.authenticate();

    // Check if the user is authenticated
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the user from the MySQL database using Sequelize
    const user = await User.findByPk(session.user.id);

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { productId } = await req.json();

    if (!productId) {
      return new NextResponse("Product Id required", { status: 400 });
    }

    // Check if the product is already in the user's wishlist
    const isLiked = user.wishlist.includes(productId);

    if (isLiked) {
      // Remove the product from the wishlist if it's already there
      user.wishlist = user.wishlist.filter((id: string) => id !== productId);
    } else {
      user.wishlist.push(productId);
    }

    // Save the updated user data back to the database
    await user.save();

    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    console.log("[wishlist_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
