import ProductCard from "@/components/ProductCard";
import { NextRequest } from "next/server";

const SearchPage = async ({ params }: { params: { query: string } }) => {
  const searchQuery = params.query;

  // Fetch search results from the API endpoint
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/search/${searchQuery}`
  );
  const searchedProducts = await response.json();

  const decodedQuery = decodeURIComponent(searchQuery);

  return (
    <div className="px-10 py-5">
      <p className="text-heading3-bold my-10">
        Search results for {decodedQuery}
      </p>
      {!searchedProducts ||
        (searchedProducts.length === 0 && (
          <p className="text-body-bold my-5">No result found</p>
        ))}
      <div className="flex flex-wrap justify-between gap-16">
        {searchedProducts?.map((product: ProductType) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export const dynamic = "force-dynamic";

export default SearchPage;
