"use client";

import { useRouter, useParams } from "next/navigation";
import { getCollectionById } from "@/lib/models/Collection";
import ProductCard from "./ProductCard";

const BestSellers = async () => {
  const router = useRouter();
  const { collectionId } = useParams();

  // Ensure collectionId is a valid string
  if (!collectionId || Array.isArray(collectionId)) {
    return <p className="text-body-bold">Loading...</p>;
  }

  let bestSellersCollection: CollectionType | null;

  try {
    // Fetch collection by ID
    bestSellersCollection = await getCollectionById(collectionId);
  } catch (error) {
    console.error("Error fetching the Best Sellers collection:", error);
    return <p className="text-body-bold">Failed to load collections</p>;
  }

  return (
    <div className="pb-6">
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-0 max-w-screen-lg">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bestSellersCollection &&
          bestSellersCollection.products &&
          bestSellersCollection.products.length > 0 ? (
            bestSellersCollection.products.map((product: ProductType) => (
              <div key={product.id} className="relative group overflow-hidden">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="text-body-bold">No Best Sellers found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestSellers;
