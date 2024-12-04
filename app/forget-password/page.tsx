"use client";

import { FC, useState } from "react";
import { Input } from "@nextui-org/react";
import { generatePassResetLink } from "../actions/auth";
import { useRouter } from "next/navigation";

const ForgetPassword: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Use email as formData for the password reset request
      const formData = new FormData();
      formData.append("email", email);

      const response = await generatePassResetLink(
        { message: "", error: "" },
        formData
      );

      if (response.success) {
        setSuccessMessage("Password reset link sent successfully.");
        setTimeout(() => router.push("/sign-in"), 3000);
      } else {
        setError(
          response.error || "An error occurred while sending the reset link."
        );
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-yellow-500 via-neutral-800 to-amber-600">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-amber-800 mb-6 text-center">
          Forgot Password?
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <Input
            name="email"
            placeholder="johndoe@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 mb-4 border border-gray-300 rounded-lg text-base sm:text-lg"
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
              "Request Reset Link"
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
          <p className="text-sm text-amber-950">Remember your password?</p>
          <a href="/sign-in" className="text-sm text-amber-800 hover:underline">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
