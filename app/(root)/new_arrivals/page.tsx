import ProductCard from "@/components/ProductCard";
import { getCollectionDetails } from "@/lib/actions/actions";
import { ProductType } from "@/lib/types";

const NewArrivalsPage = async () => {
  const newArrivalsCollectionId = "66ee1f19ebf40ec55768d0e8";
  let newArrivalsCollection;

  try {
    newArrivalsCollection = await getCollectionDetails(newArrivalsCollectionId);
    console.log("New Arrivals Collection:", newArrivalsCollection);
  } catch (error) {
    console.error("Error fetching the New Arrivals collection:", error);
    return <p className="text-body-bold">Failed to load collections</p>;
  }

  return (
    <div className="px-10 py-5 flex flex-col gap-8">
      <h1 className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r from-yellow-400 via-yellow-900 to-amber-500 text-white py-4 px-8 rounded-lg shadow-lg after:content-[''] after:w-16 after:h-1 after:bg-yellow-400 after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2">
        New Arrivals
      </h1>
      {newArrivalsCollection && newArrivalsCollection.products.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {newArrivalsCollection.products.map((product: ProductType) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-body-bold">No new arrivals found...</p>
      )}
    </div>
  );
};

export const dynamic = "force-dynamic";

export default NewArrivalsPage;
