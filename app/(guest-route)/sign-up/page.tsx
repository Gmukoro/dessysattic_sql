"use client";

import { FC, useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { signUp } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

const SignUp: FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await signUp({}, formData);

      if (response.success) {
        setSuccessMessage(
          "Sign-up successful! Please check your email for verification."
        );
        setTimeout(() => {
          router.push("/sign-in");
        }, 3000);
      } else {
        setError(response.error || "Sign-up failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-r via-neutral-800 to-gray-700">
      <div className="bg-white rounded-lg shadow-lg p-6 sm:p-6 max-w-md w-full">
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-800 mb-6 text-center">
          Sign-up to Dessysattic
        </h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          {/* Name Input */}
          <Input
            placeholder="John Doe"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg text-base sm:text-lg"
          />

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
              "Sign Up"
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
          <p className="text-sm text-amber-950">Already have an account?</p>
          <a href="/sign-in" className="text-sm text-amber-800 hover:underline">
            Sign In
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

export default SignUp;
