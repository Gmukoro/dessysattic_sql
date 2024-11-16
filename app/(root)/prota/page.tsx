"use client";

import { useRouter, useParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getCollectionById } from "@/lib/models/Collection";

const ProtaPage = async () => {
  const router = useRouter();
  const { collectionId } = useParams();

  if (!collectionId) {
    return <p className="text-body-bold">Loading...</p>;
  }

  let protaCollection: CollectionType | null = null;

  try {
    const collectionIdNumber = parseInt(collectionId as string, 10);
    protaCollection = await getCollectionById(collectionIdNumber);
    console.log("Prota Collection:", protaCollection);
  } catch (error) {
    console.error("Error fetching the Prota collection:", error);
    return <p className="text-body-bold">Failed to load Prota collection</p>;
  }

  return (
    <div className="px-10 py-5 flex flex-col gap-8">
      <h1 className="text-heading2-bold text-4xl font-bold mb-8 bg-gradient-to-r from-yellow-600 via-yellow-900 to-amber-800 text-white py-4 px-8 rounded-lg ">
        Prota Collection
      </h1>
      {protaCollection &&
      protaCollection.products &&
      protaCollection.products.length > 0 ? (
        <div className="flex flex-wrap gap-16 justify-center">
          {protaCollection.products.map((product: ProductType) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-body-bold">No Prota products found</p>
      )}
    </div>
  );
};

export const dynamic = "force-dynamic";
export default ProtaPage;
