"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewsletterSubscription: React.FC = () => {
  const [email, setEmail] = useState({ email: "" });
  const [error, setError] = useState<string | string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEmail({
      ...email,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data Submitted:", email);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(email),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        console.error("Error response:", errorResponse);
        setError(["Error occurred: " + errorResponse.msg]);
        toast.error("Error occurred: " + errorResponse.msg);
        return;
      }

      const data = await res.json();
      setError([]);
      toast.success("Email submitted successfully!");
      setEmail({ email: "" });
    } catch (error) {
      console.error("Failed to submit form:", error);
      setError(["An unexpected error occurred."]);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <section className="bg-gray-200 py-6 px-4 sm:px-3 md:px-4">
      <ToastContainer />
      <h2 className="text-2xl text-amber-900 sm:text-3xl font-bold text-center mb-2 sm:mb-2">
        JOIN OUR NEWSLETTER
      </h2>
      <p className="sm:text-xl text-center mb-3 sm:mb-4">
        ENJOY 10% OFF YOUR FIRST ORDER WHEN YOU SIGN UP
      </p>
      {error.length > 0 && (
        <div className="text-red-500 text-center mb-4">
          {Array.isArray(error) ? error.join(", ") : error}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto flex flex-col items-center"
      >
        <input
          type="email"
          name="email"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg text-base sm:text-lg"
          placeholder="Enter your email"
          value={email.email}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="relative bg-gradient-to-r from-yellow-700 via-yellow-900 to-amber-700 text-neutral-200 px-6 py-2 rounded-lg text-base sm:text-lg hover:bg-yellow-600 transition-colors duration-300"
        >
          Subscribe
        </button>
      </form>
    </section>
  );
};

export default NewsletterSubscription;
