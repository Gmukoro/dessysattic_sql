"use client";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [error, setError] = useState<string | string[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log("Current Form Data:", formData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    try {
      const res = await fetch("api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorResponse = await res.json();
        console.error("Error response:", errorResponse);
        setError(["Error occurred: " + errorResponse.msg]);

        toast.error("Error occurred: " + errorResponse.msg);

        return;
      }

      const data = await res.json();
      console.log("Received data:", data);
      setError(data.msg || "Form submitted successfully!");

      toast.success("Form submitted successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to submit form:", error);
      setError(["An unexpected error occurred."]);

      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r  text-amber-900 py-4 px-8 rounded-lg shadow-lg after:content-[''] after:w-16 after:h-1 after:bg-yellow-400 after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2">
        Contact Us
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-medium">
            Full Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            required
            className="border w-full p-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-medium">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="John@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="border w-full p-2 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="message" className="block font-medium">
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Type your message here"
            value={formData.message}
            onChange={handleChange}
            required
            className="border w-full p-2 rounded-md"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-400 via-yellow-900 to-amber-500 text-center text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
};

export default ContactPage;
