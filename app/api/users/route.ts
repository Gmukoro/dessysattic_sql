//app\api\users\route.ts

import { auth } from "@/auth";
import { NextResponse } from "next/server";
import User from "@/lib/models/user";
import sequelize from "@/app/api/sequelize.config";

await sequelize!.authenticate();

export async function GET(req: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findByPk(session.user.id, { include: ["wishlist"] });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ wishlist: user.wishlist });
}
