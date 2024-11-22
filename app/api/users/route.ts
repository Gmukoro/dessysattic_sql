// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/models/user"; // Adjust path if necessary
import { auth } from "@/auth"; // Adjust path if necessary

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(session.user.id);
    console.log(session.user.id)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ wishlist: user.wishlist }, { status: 200 });
    console.log( user.wishlist)

  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
