"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";
import { AiFillStar } from "react-icons/ai";
import { getReviewsByProductId } from "@/lib/models/reviews";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Review {
  _id: string;
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
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const reviewsPerPage = 5;

  // State for form fields
  const [formName, setFormName] = useState<string>("");
  const [formEmail, setFormEmail] = useState<string>("");
  const [formContent, setFormContent] = useState<string>("");
  const [formRating, setFormRating] = useState<number>(1);
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviewsByProductId(productId);
        setReviews(data as Review[]);
      } catch (err) {
        toast.error("Failed to fetch reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!session || !session.user) {
      toast.error("You must sign in to submit a review.");
      return signIn();
    }

    try {
      setLoading(true);
      const newReview = {
        name: formName,
        email: formEmail,
        content: formContent,
        rating: formRating,
        productId,
      };

      const response = await axios.post(`/api/review`, newReview, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        setReviews((prev) => [...prev, response.data]);
        setFormName("");
        setFormEmail("");
        setFormContent("");
        setFormRating(1);
        setIsFormVisible(false);
        toast.success("Review submitted successfully!");
      } else {
        throw new Error("Failed to submit review. Please try again.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message ||
            "Failed to submit review. Please check your input."
        );
      } else {
        toast.error("An unknown error occurred. Please try again.");
      }
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

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading reviews...</p>;

  return (
    <div className="mt-8 w-full">
      <h2 className="text-4xl text-amber-900 font-bold mb-4">Reviews</h2>
      <div className="bg-gray-200 p-6 rounded-lg">
        {currentReviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          currentReviews.map((review) => (
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
                <p className="text-amber-700 mt-2 md:mt-0">{review.content}</p>
                <p className="text-amber-700 mt-2 md:mt-0 text-sm">
                  {formatTimeAgo(review.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-4">
        {Array.from(
          { length: Math.ceil(reviews.length / reviewsPerPage) },
          (_, index) => (
            <button
              key={index}
              className={`py-2 px-4 ${
                index + 1 === currentPage
                  ? "bg-amber-800 text-white"
                  : "bg-gray-300"
              } rounded`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </button>
          )
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
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Your Name"
            className="border p-2 mb-2 w-full"
            required
          />
          <input
            type="email"
            name="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
            placeholder="Your Email"
            className="border p-2 mb-2 w-full"
            required
          />
          <textarea
            name="content"
            value={formContent}
            onChange={(e) => setFormContent(e.target.value)}
            placeholder="Your Review"
            className="border p-2 mb-2 w-full"
            required
          />
          <select
            name="rating"
            value={formRating}
            onChange={(e) => setFormRating(Number(e.target.value))}
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
