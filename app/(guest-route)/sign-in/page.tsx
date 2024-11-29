"use client";

import { FC, useActionState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import AuthForm from "@/components/AuthForm";
import { continueWithCredentials } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import router from "next/router";
import { useSession } from "next-auth/react";

interface Props {}

const SignIn: FC<Props> = () => {
  const [state, signInAction] = useActionState(continueWithCredentials, {});

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to- via-neutral-800 to-gray-700">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-amber-800 mb-6 text-center">
            Sign-in to Dessysattic
          </h1>
          <AuthForm
            action={signInAction}
            footerItems={[
              {
                label: "Create an account",
                linkText: "Sign Up",
                link: "/sign-up",
              },
              {
                label: "Having trouble",
                linkText: "Forget password",
                link: "/forget-password",
              },
            ]}
            btnLabel="Sign In"
            error={state.error}
            message={state.success ? "Sign in successful" : ""}
            className="space-y-4"
          >
            {/* Add hidden input for redirectTo */}
            <Input
              placeholder="johndoe@email.com"
              name="email"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg text-base sm:text-lg"
            />
            <Input
              placeholder="********"
              type="password"
              name="password"
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg text-base sm:text-lg"
            />
          </AuthForm>
        </div>
      </div>
    </>
  );
};

export default SignIn;
