import { getCollectionDetails } from "@/lib/actions/actions";
import { CollectionType, ProductType } from "@/lib/types";
import ProductCard from "./ProductCard";

const BestSellers = async () => {
  const bestSellersCollectionId = "66f738c8a642bfc5ef2bd0f8";
  let bestSellersCollection: CollectionType | null;

  try {
    bestSellersCollection = await getCollectionDetails(bestSellersCollectionId);
  } catch (error) {
    console.error("Error fetching the Best Sellers collection:", error);
    return <p className="text-body-bold">Failed to load collections</p>;
  }

  return (
    <div className="pb-6">
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-0 max-w-screen-lg">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {bestSellersCollection &&
          bestSellersCollection.products.length > 0 ? (
            bestSellersCollection.products.map((product: ProductType) => (
              <div key={product._id} className="relative group overflow-hidden">
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
