import AuthSubmitButton from "@/components/AuthSubmitButton";
import UpdatePasswordForm from "@/components/UpdatePasswordForm";
import { notFound } from "next/navigation";
import { FC } from "react";
import {
  comparePasswordResetToken,
  findOne,
} from "@/lib/models/passwordResetToken";

interface Props {
  searchParams: {
    token: string;
    userId: string;
  };
}

const UpdatePassword: FC<Props> = async ({ searchParams }) => {
  const { token, userId } = searchParams;

  try {
    const resetToken = await findOne(userId);

    if (!resetToken || !comparePasswordResetToken(token, "resetToken.token")) {
      throw new Error("Invalid token");
    }
  } catch (error) {
    return notFound();
  }

  return <UpdatePasswordForm token={token} userId={userId} />;
};

export default UpdatePassword;
