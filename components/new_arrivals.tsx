import ProductCard from "@/components/ProductCard";
import { getNewArrivalsProducts } from "@/lib/models/Collection";
import {
  getCollectionProductsById,
  ProductAttributes,
} from "@/lib/models/Product";

const New = async () => {
  const collectionName = 3;
  let newCollection: ProductAttributes[] | null = null;

  try {
    // Fetch products from the "New Arrivals" collection
    newCollection = await getCollectionProductsById(3);
  } catch (error) {
    console.error("Error fetching the prota collection:", error);
    return <p className="text-body-bold">Failed to load collections</p>;
  }

  // Show loader while fetching data
  if (!newCollection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader w-10 h-10 border-4 border-t-amber-800 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Display message if no products are found
  if (newCollection.length === 0) {
    return (
      <div className="px-4 sm:px-6 py-5">
        <p className="text-body-bold">No products found...</p>
      </div>
    );
  }

  return (
    <div className="lg:p-6 sm:px-3 md:px-6 py-6 flex flex-col gap-6">
      {/* Responsive container */}
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {newCollection.map((product) => (
          <div
            key={product.id}
            className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] relative group overflow-hidden transform transition duration-300 hover:scale-105"
          >
            {/* Caption at the top-left corner */}
            <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded shadow">
              New
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
export default New;
