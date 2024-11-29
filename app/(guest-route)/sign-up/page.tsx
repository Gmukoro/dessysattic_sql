//app\(guest-route)\sign-up\page.tsx

"use client";

import { FC, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import AuthForm from "@/components/AuthForm";
import { signUp } from "../../actions/auth";

const SignUp: FC = () => {
  const router = useRouter();
  const [state, signUpAction] = useActionState(signUp, {
    success: false,
    errors: {},
    error: undefined,
  });

  // Trigger toast notifications and handle redirection
  useEffect(() => {
    if (state.success) {
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
    } else if (state.error) {
    }
  }, [state.success, state.error, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to- via-neutral-800 to-gray-700">
      {/* Toaster for rendering toast notifications */}
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-amber-800 mb-6 text-center">
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
          <input
            placeholder="John Doe"
            name="name"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg text-base sm:text-lg"
          />
          <input
            placeholder="johndoe@email.com"
            name="email"
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg text-base sm:text-lg"
          />
          <input
            placeholder="********"
            type="password"
            name="password"
            className="w-full px-4 py-2 my-4 border border-gray-300 rounded-lg text-base sm:text-lg"
          />
        </AuthForm>
      </div>
    </div>
  );
};

export default SignUp;
