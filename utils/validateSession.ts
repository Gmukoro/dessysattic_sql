// utils/validateSession.ts
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const validateSession = async () => {
  const session = await auth();
  if (!session || !session.user) {
    return new NextResponse("Unauthorized", { status: 403 });
  }
  return session;
};
