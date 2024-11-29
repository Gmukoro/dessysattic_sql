import ProductCard from "@/components/ProductCard";
import {
  getCollectionProductsByName,
  ProductAttributes,
} from "@/lib/models/Product";

const BestSellersPage = async () => {
  const collectionName = "Best Sellers";
  let bestSellersCollection: ProductAttributes[] | null = null;

  try {
    bestSellersCollection = await getCollectionProductsByName(collectionName);
  } catch (error) {
    console.error("Error fetching the Best Sellers collection:", error);
    return <p className="text-body-bold">Failed to load collections</p>;
  }

  // Show loader while fetching data
  if (!bestSellersCollection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader w-10 h-10 border-4 border-t-amber-800 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Display message if no products are found
  if (bestSellersCollection.length === 0) {
    return (
      <div className="px-4 sm:px-6 md:px-10 py-5">
        <p className="text-body-bold">No Best Sellers found...</p>
      </div>
    );
  }

  return (
    <div className="lg:p-6 sm:px-3 md:px-6 py-6 flex flex-col gap-6">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 sm:gap-4 md:gap-6 lg:gap-8">
        {bestSellersCollection.map((product) => (
          <div
            key={product.id}
            className="relative group overflow-hidden transform transition duration-300 hover:scale-105"
          >
            {/* Caption at the top-left corner */}
            <div className="absolute top-2 left-1 bg-yellow-600 text-white text-xs font-semibold px-2 py-1 rounded shadow">
              Best
            </div>

            {/* Product Card */}
            <ProductCard
              product={{
                ...product,
                collections: product.collections || "Default Collection",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export const dynamic = "force-dynamic";
export default BestSellersPage;
