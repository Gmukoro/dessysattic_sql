import { FC } from "react";
import {
  cleanupExpiredTokens,
  compareToken,
  getTokenByUserId,
} from "@/lib/models/verificationToken";
import { updateUser } from "@/lib/models/user";
import { notFound } from "next/navigation";
import VerificationSuccess from "@/components/VerificationSuccess";

interface Props {
  searchParams: {
    token: string;
    userId: number;
  };
}

const Verify: FC<Props> = async ({ searchParams }) => {
  const { token, userId } = searchParams;

  try {
    const verificationToken = await getTokenByUserId(userId);
    if (verificationToken && compareToken(verificationToken.token, token)) {
      // token is verified
      await updateUser(userId, { verified: true });
      await cleanupExpiredTokens(verificationToken.id);
    } else {
      throw new Error();
    }
  } catch (error) {
    notFound();
  }

  return <VerificationSuccess />;
};

export default Verify;
