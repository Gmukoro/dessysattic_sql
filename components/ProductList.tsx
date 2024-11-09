import { getProducts } from "@/lib/actions/actions";
import ProductCard from "./ProductCard";
import { ProductType } from "@/lib/types";

const ProductList = async () => {
  let products: ProductType[] = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <div className="pb-6">
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-0 max-w-screen-lg">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products && products.length > 0 ? (
            products.map((product: ProductType) => (
              <div key={product._id} className="relative group overflow-hidden">
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="text-body-bold">No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
