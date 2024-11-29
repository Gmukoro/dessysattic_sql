"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import Loader from "./Loader";

interface Review {
  id: string;
  content: string;
  rating: number;
  name: string;
  createdAt: string;
}

const ReviewsComponent = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if reviews are already cached in localStorage
    const cachedReviews = localStorage.getItem("reviews");

    if (cachedReviews) {
      // If reviews exist in localStorage, use them
      setReviews(JSON.parse(cachedReviews));
      setLoading(false);
    } else {
      // If not cached, fetch reviews from the API
      const fetchReviews = async () => {
        try {
          const response = await fetch("/api/reviews", {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error(await response.text());
          }

          const fetchedReviews: Review[] = await response.json();
          if (fetchedReviews.length === 0) {
            setError("No reviews available");
          } else {
            setReviews(fetchedReviews);
            // Cache the reviews in localStorage
            localStorage.setItem("reviews", JSON.stringify(fetchedReviews));
          }
          setLoading(false);
        } catch (err) {
          console.error("Error fetching reviews:", err);
          setError("Failed to fetch reviews");
          setLoading(false);
        }
      };

      fetchReviews();
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-white">{error}</p>;
  }

  return (
    <div className="px-4 py-6 bg-amber-900 sm:px-6 md:px-8 lg:px-10 relative">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center text-white">
        What Our Customers Say
      </h2>
      {reviews.length > 0 ? (
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="text-center">
                <div className="p-4 rounded-md shadow-sm bg-amber-700 text-white">
                  <p className="font-semibold text-amber-950">{review.name}</p>
                  <p className="text-gray-300">{review.content}</p>
                  <p className="text-amber-400">{"⭐".repeat(review.rating)}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Buttons */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 swiper-button-prev cursor-pointer z-10">
            <HiArrowLeft className="text-white text-2xl" />
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 swiper-button-next cursor-pointer z-10">
            <HiArrowRight className="text-white text-2xl" />
          </div>
        </div>
      ) : (
        <p className="text-white">No reviews available</p>
      )}
    </div>
  );
};

export default ReviewsComponent;
