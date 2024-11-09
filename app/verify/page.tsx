// app/verify/page.tsx

import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user";
import VerificationToken from "@/lib/models/verificationToken";
import sequelize from "@/app/api/sequelize.config";

export const verifyUser = async (req: NextRequest) => {
  try {
    // Retrieve `userId` from the request body
    const { userId, token } = await req.json();

    // Find the verification token using Sequelize's `findOne` method
    const verificationToken = await VerificationToken.findOne({
      where: { userId: userId, token: token },
    });

    if (!verificationToken) {
      return new NextResponse("Verification token not found", { status: 404 });
    }

    // Update the user to verified if the token is valid
    await User.update(
      { verified: true },
      { where: { id: verificationToken.userId } } // Use `id` instead of `_id`
    );

    // Delete the verification token after successful verification
    await VerificationToken.destroy({
      where: { id: verificationToken.id }, // Use `id` instead of `_id`
    });

    return new NextResponse("User verified successfully", { status: 200 });
  } catch (error) {
    console.error("[verifyUser]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
