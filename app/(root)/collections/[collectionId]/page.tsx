import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import React from "react";

const CollectionDetails = async ({
  params,
}: {
  params: { collectionId: string };
}) => {
  // Fetch collection details from the API route
  const res = await fetch(`/api/collections/${params.collectionId}`);
  const collectionDetails = await res.json();

  if (!collectionDetails) {
    return <p className="text-heading3-bold text-amber-950">No collections</p>;
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

export const dynamic = "force-dynamic";
