import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getUserByEmail, getUserById } from "@/lib/models/user";

// Format user data to maintain consistent structure
const formatUser = (user: any): UserType => ({
  ...user,
  avatar: JSON.parse(user.avatar || "{}"),
  wishlist: user.wishlist ? JSON.parse(user.wishlist) : [],
});

export async function GET(req: Request) {
  const session = await auth();

  // Check if session exists and user is authenticated
  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch the user using the model function
    const user = await getUserById(session.user.email);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format the user data before returning it
    const formattedUser = formatUser(user);

    // Return the formatted wishlist from the user model
    return NextResponse.json({ wishlist: formattedUser.wishlist });
  } catch (error) {
    console.error("Error fetching user or wishlist:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
