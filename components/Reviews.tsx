"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getReviews } from "@/lib/actions/actions";
import { auth } from "@/auth";
import { useSession } from "next-auth/react";
import { AiFillStar } from "react-icons/ai";

interface Review {
  _id: null | undefined;
  content: string;
  rating: number;
  title: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ReviewsProps {
  productId: string;
}

const Reviews: React.FC<ReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    content: "",
    rating: 1,
    productId: productId,
  });
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews(productId);
        setReviews(data ?? []);
      } catch (err) {
        setError("Failed to fetch reviews. Please try again later.");
        setTimeout(() => setError(null), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewReview((prev) => ({
      ...prev,
      rating: parseInt(e.target.value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data: session } = useSession();
      console.log("Session:", session);

      if (!session || !session.user) {
        setError("Please sign in to submit a review");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/review`,
        newReview,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 201) {
        setReviews((prev) => [...prev, response.data]);
        setNewReview({
          name: "",
          email: "",
          content: "",
          rating: 1,
          productId,
        });
        setError(null);
        alert("Review submitted successfully!");
      } else {
        throw new Error("Failed to submit review, please try again.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Failed to submit review. Please check your input."
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
      console.error("Error submitting review:", err);

      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds >= 31536000)
      return `${Math.floor(seconds / 31536000)} years ago`;
    if (seconds >= 2592000)
      return `${Math.floor(seconds / 2592000)} months ago`;
    if (seconds >= 86400) return `${Math.floor(seconds / 86400)} days ago`;
    if (seconds >= 3600) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds >= 60) return `${Math.floor(seconds / 60)} minutes ago`;
    return "Just now";
  };

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mt-8 w-full">
      <h2 className="text-4xl text-amber-900 font-bold mb-4">Reviews</h2>
      <div className="bg-gray-200 p-6 rounded-lg">
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border p-4 mb-4 rounded-lg bg-white"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-2 md:space-y-0 mb-4">
                <div className="md:flex md:flex-col">
                  <p className="font-bold text-amber-800">
                    Verified Buyer: {review.name}
                  </p>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: review.rating }, (_, i) => (
                      <AiFillStar key={i} />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mt-2 md:mt-0">{review.content}</p>
                <p className="text-amber-700 mt-2 md:mt-0 text-sm">
                  {formatTimeAgo(review.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setIsFormVisible((prev) => !prev)}
        className="text-black py-2 px-4"
      >
        {isFormVisible ? "Hide Review Form" : "Submit a Review"}
      </button>
      {isFormVisible && (
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="text"
            name="name"
            value={newReview.name}
            onChange={handleInputChange}
            placeholder="Your Name"
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="email"
            name="email"
            value={newReview.email}
            onChange={handleInputChange}
            placeholder="Your Email"
            className="border p-2 mb-2 w-full"
            required
          />
          <textarea
            name="content"
            value={newReview.content}
            onChange={handleInputChange}
            placeholder="Your Review"
            className="border p-2 mb-2 w-full"
            required
          />
          <select
            name="rating"
            value={newReview.rating}
            onChange={handleRatingChange}
            className="border p-2 mb-2 w-full"
            required
          >
            <option value={1}>1 Star</option>
            <option value={2}>2 Stars</option>
            <option value={3}>3 Stars</option>
            <option value={4}>4 Stars</option>
            <option value={5}>5 Stars</option>
          </select>
          <button
            type="submit"
            className="relative bg-gradient-to-r from-yellow-700 via-yellow-900 to-amber-700 text-neutral-200 px-6 py-2 rounded-lg text-base sm:text-lg hover:bg-yellow-600 transition-colors duration-300"
            disabled={loading}
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default Reviews;
