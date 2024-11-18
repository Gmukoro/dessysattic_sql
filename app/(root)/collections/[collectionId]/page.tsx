//app\(root)\collections\[collectionId]\page.tsx

"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

type CollectionType = {
  id: number;
  image: string;
  title: string;
  description: string;
  products: ProductType[];
};

type Params = {
  collectionId: string;
};

const CollectionDetails = ({ params }: { params: Params }) => {
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collectionId");

  const [collectionDetails, setCollectionDetails] =
    useState<CollectionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollectionDetails = async () => {
      if (!collectionId) return;
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/collections/${collectionId}`;
      try {
        const res = await fetch(apiUrl, { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Failed to fetch collection: ${res.status}`);
        }
        const data = await res.json();
        setCollectionDetails(data);
      } catch (err: any) {
        setError("Failed to load collection details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetails();
  }, []);

  if (loading) {
    return (
      <p className="text-amber-950 text-2xl">Loading collection details...</p>
    );
  }

  if (error) {
    return <p className="text-red-600 text-2xl">{error}</p>;
  }

  if (!collectionDetails) {
    return (
      <p className="text-heading3-bold text-amber-950 items-center">
        No collections found.
      </p>
    );
  }

  return (
    <div className="px-10 py-5 flex flex-col items-center gap-8">
      <Image
        src={collectionDetails.image}
        width={1500}
        height={1000}
        alt="collection"
        className="w-full h-[400px] object-cover rounded-xl"
      />
      <p className="text-heading3-bold text-amber-950">
        {collectionDetails.title}
      </p>
      <p className="text-body-normal text-grey-2 text-center max-w-[900px]">
        {collectionDetails.description}
      </p>
      <div className="flex flex-wrap gap-16 justify-center">
        {collectionDetails.products.map((product: ProductType) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CollectionDetails;
