// app/page.tsx

import React from "react";
import ProductList from "@/components/ProductList";
import BestSellers from "@/components/Best_sellers";
import Collections from "@/components/Collections";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import ReviewsComponent from "@/components/allReviews";
import ShippingOfferModal from "@/components/ShippingOfferModal";
import Loading from "@/components/Loading";

export default function Home() {
  return (
    <>
      <div className="relative h-screen sm:h-[80vh] md:h-[90vh] overflow-hidden">
        <VideoPlayer />
        <div className="absolute px-16 inset-0 flex flex-col justify-center text-white font-bold">
          <h1 className="text-heading1-bold sm:text-6xl md:text-8xl lg:text-9xl xl:text-[100px]">
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
        <h2 className="text-heading2-bold text-4xl font-bold mb-8 mt-8 relative bg-gradient-to-r text-neutral-600 px-20">
          Próta
        </h2>
        <ProductList />
        <Collections />
        <ReviewsComponent />
        <h2 className="text-heading2-bold text-4xl font-bold mb-8 mt-8 relative bg-gradient-to-r text-neutral-600 px-20">
          Best Sellers
        </h2>
        <BestSellers />
      </div>
    </>
  );
}
