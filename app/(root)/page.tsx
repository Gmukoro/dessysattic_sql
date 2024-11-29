import React from "react";
import ProductList from "@/components/ProductList";
import BestSellers from "@/components/Best_sellers";
import Collections from "@/components/Collections";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
// import ReviewsComponent from "@/components/allReviews";
import ShippingOfferModal from "@/components/ShippingOfferModal";
import Loading from "@/components/Loading";
import ReviewsComponent from "@/components/allReviews";

export default function Home() {
  return (
    <>
      {/* Full page blurred background
      <div
        className="absolute inset-0 bg-cover bg-center z-[-1]"
        style={{
          backgroundImage: "url('/logo.png')", // Path to the logo/image for the background
          backgroundSize: "cover", // Make the image cover the whole page
          backgroundPosition: "center", // Ensure it's centered
          filter: "blur(10px)", // Apply a blur effect to the background image
        }}
      ></div> */}
      {/* Main content */}
      <div className="relative h-screen sm:h-[80vh] md:h-[90vh] overflow-hidden">
        <VideoPlayer />
        <div className="absolute px-16 inset-0 flex flex-col justify-center text-white font-bold">
          <h1 className="text-heading1-bold  sm:text-6xl md:text-8xl lg:text-9xl xl:text-[100px]">
            Próta
          </h1>
          <p className="heading2-bold text-amber-950 sm:text-xl md:text-2xl">
            Wear your confidence
          </p>
          <Link href="/new_arrivals" passHref>
            <button className="mt-4 w-full sm:w-1/4 bg-white text-black py-3 text-xl rounded-lg">
              Shop New Arrivals
            </button>
          </Link>
        </div>
      </div>
      <ShippingOfferModal />
      <div>
        <h2 className="text-heading2-bold text-center text-4xl font-bold mb-8 mt-8 relative bg-gradient-to-r text-neutral-600 px-20">
          Próta
        </h2>
        <ProductList />
        <Collections />

        <ReviewsComponent />
        <h2 className="text-heading2-bold text-2xl sm:text-3xl md:text-4xl font-bold mb-4 mt-8 relative bg-gradient-to-r text-neutral-600 text-center px-6 sm:px-10 lg:px-20">
          Best Sellers
        </h2>

        <BestSellers />
      </div>
    </>
  );
}
