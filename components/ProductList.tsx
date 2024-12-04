"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Loader from "./Loader";

function ProductList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Async function for fetching data
    const fetchProducts = async () => {
      try {
        // Fetch products from the API endpoint
        const res = await fetch(`/api/products`);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="lg:p-6 sm:px-3 md:px-6 py-6 flex flex-col gap-6">
      {/* Responsive container */}
      <div className="flex flex-wrap gap-2 sm:gap-4">
        {products.length > 0 ? (
          products.map((product: ProductType) => (
            <div
              key={product.id}
              className="w-[48%] sm:w-[48%] md:w-[30%] lg:w-[18%] relative group overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <p className="text-body-bold">No products found</p>
        )}
      </div>
    </div>
  );
}

export default ProductList;
