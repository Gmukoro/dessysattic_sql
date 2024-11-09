"use client";

import { FC, useActionState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import AuthForm from "@/components/AuthForm";
import { signUp } from "../../actions/auth";
import { useRouter } from "next/navigation";

interface Props {}

const SignUp: FC<Props> = () => {
  const router = useRouter();
  const [state, signUpAction] = useActionState(signUp, {});

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-yellow-200 via-neutral-800 to-amber-600">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-amber-800 mb-6 text-center">
          Dessysattic Store Sign-up
        </h1>
        <AuthForm
          action={signUpAction}
          footerItems={[
            {
              label: "Already have an account?",
              linkText: "Sign In",
              link: "/sign-in",
            },
            {
              label: "Having trouble",
              linkText: "Forget password?",
              link: "/forget-password",
            },
          ]}
          btnLabel="Sign Up"
          error={state.error}
          message={
            state.success
              ? "Please check your email. Check spam messages if you can't find it in your inbox"
              : ""
          }
          className="space-y-4"
        >
          <Input
            placeholder="John Doe"
            name="name"
            className="px-4 py-2 mb-4 border border-gray-300 rounded-lg text-base sm:text-lg"
            style={{ height: "20px" }}
          />
          <Input
            placeholder="johndoe@email.com"
            name="email"
            className="px-4 py-2 mb-4 border border-gray-300 rounded-lg text-base sm:text-lg"
            style={{ height: "20px" }}
          />
          <Input
            placeholder="********"
            type="password"
            name="password"
            className="px-4 py-2 my-4 border border-gray-300 rounded-lg text-base sm:text-lg"
            style={{ height: "20px" }}
          />
        </AuthForm>
      </div>
    </div>
  );
};

export default SignUp;
