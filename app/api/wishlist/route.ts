// app/api/wishlist/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addToWishlist, getUserById } from "@/lib/models/user";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      console.log("User not authenticated or missing user ID");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);

    if (!user) {
      console.log("User not found in database for ID:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Read the body as JSON
    const body = await req.json();

    const updatedWishlist = await addToWishlist(userId, body);
    console.error(updatedWishlist);
    return NextResponse.json({ wishlist: updatedWishlist }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
