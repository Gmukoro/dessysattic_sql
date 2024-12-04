"use client";

import { FC, useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { continueWithCredentials } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "@/components/Loader";

const SignIn: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Make sure session is loaded before redirecting
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.replace("/"); // Redirect to home page when authenticated
  //   }
  // }, [status, router]);

  // if (status === "loading") {
  //   return (
  //     <div>
  //       <Loader />
  //     </div>
  //   );
  // }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await continueWithCredentials({}, formData);

      if (response.success) {
        setSuccessMessage("Sign in successful!");
        window.location.reload();
      } else {
        setError(response.error || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-r via-neutral-800 to-gray-700">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-6 max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-800 mb-6 text-center">
          Sign-in to Dessysattic
        </h1>
        <form onSubmit={handleSignIn} className="space-y-4">
          {/* Email Input */}
          <Input
            placeholder="johndoe@email.com"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg text-base sm:text-lg"
          />

          {/* Password Input */}
          <Input
            placeholder="********"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg text-base sm:text-lg"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full text-center bg-amber-800 text-white rounded-md p-2 transition duration-200 hover:bg-amber-700 cursor-pointer"
          >
            {isLoading ? (
              <div className="border-gray-300 h-4 w-4 animate-spin rounded-full border-2 border-t-amber-800 mx-auto" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Success or Error Message */}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {successMessage && (
          <p className="text-green-500 mt-4 text-center">{successMessage}</p>
        )}

        {/* Footer Links */}
        <div className="mt-4 text-center">
          <p className="text-sm text-amber-950">Don't have an account?</p>
          <a href="/sign-up" className="text-sm text-amber-800 hover:underline">
            Sign Up
          </a>
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm text-amber-950">Having trouble?</p>
          <a
            href="/forget-password"
            className="text-sm text-amber-800 hover:underline"
          >
            Forget Password
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
