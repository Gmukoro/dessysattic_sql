//app\api\users\route.ts

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/models/user";

export async function GET(req: Request) {
  const session = await auth();

  // Check if session exists and user is authenticated
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch the user using the model function
    const user = await getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the wishlist from the user model
    return NextResponse.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error fetching user or wishlist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
