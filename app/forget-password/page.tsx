"use client";

import { FC } from "react";
import { Input } from "@nextui-org/react";
import AuthForm from "@/components/AuthForm";
import { useFormState } from "react-dom";
import { generatePassResetLink } from "../actions/auth";

interface Props {}

const ForgetPassword: FC<Props> = () => {
  const [state, action] = useFormState(generatePassResetLink, {
    error: "",
    message: "",
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-yellow-500 via-neutral-800 to-amber-600">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-amber-800 mb-6 text-center">
          Forgot Password?
        </h1>
        <AuthForm
          action={action}
          error={state.error}
          message={state.message}
          btnLabel="Request Reset Link"
          footerItems={[
            {
              label: "Create an account",
              linkText: "Sign Up",
              link: "/sign-up",
            },
            {
              label: "Already have an account?",
              linkText: "Sign In",
              link: "/sign-in",
            },
          ]}
        >
          <Input
            name="email"
            placeholder="johndoe@email.com"
            type="text"
            className="px-4 py-2 mb-4 border border-gray-300 rounded-lg text-base sm:text-lg"
          />
        </AuthForm>
      </div>
    </div>
  );
};

export default ForgetPassword;
