import ProductCard from "@/components/ProductCard";
import {
  getCollectionIdByTitle,
  getCollectionProductsByName,
  getProductsByCollectionId,
  ProductAttributes,
} from "@/lib/models/Product";

const NewArrivalsPage = async () => {
  const collectionTitle = "New";
  let newArrivalsCollection: ProductAttributes[] | null = null;

  try {
    // First, get the collection ID based on the collection title
    const collectionId = await getCollectionIdByTitle(collectionTitle);

    if (collectionId) {
      // Fetch products using the collection ID
      newArrivalsCollection = await getProductsByCollectionId(collectionId);
    } else {
      console.error("Collection not found!");
      return <p className="text-body-bold">Collection not found</p>;
    }
  } catch (error) {
    console.error("Error fetching the New Arrivals collection:", error);
    return <p className="text-body-bold">Failed to load collections</p>;
  }

  // Show loader while fetching data
  if (!newArrivalsCollection) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader w-10 h-10 border-4 border-t-amber-800 border-gray-300 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Display message if no products are found
  if (newArrivalsCollection.length === 0) {
    return (
      <div className="px-10 py-5">
        <p className="text-body-bold">No New Arrivals found...</p>
      </div>
    );
  }

  return (
    <div className="px-10 py-5 flex flex-col gap-8">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {newArrivalsCollection.map((product) => (
          <div
            key={product.id}
            className="relative group overflow-hidden transform transition duration-300 hover:scale-105"
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

export const dynamic = "force-dynamic"; // This ensures the page is dynamically rendered
export default NewArrivalsPage;
