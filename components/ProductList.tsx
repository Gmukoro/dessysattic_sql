"use client";

import { Suspense, useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Loader from "./Loader";

function ProductList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if the products are already in localStorage
    const cachedProducts = localStorage.getItem("products");

    if (cachedProducts) {
      // If data exists in localStorage, use it
      setProducts(JSON.parse(cachedProducts));
      setLoading(false);
    } else {
      // If not cached, fetch products from the API
      async function fetchProducts() {
        try {
          const res = await fetch("http://localhost:3000/api/products");
          if (!res.ok) {
            throw new Error("Failed to fetch products");
          }
          const data = await res.json();
          setProducts(data);

          // Cache the products in localStorage
          localStorage.setItem("products", JSON.stringify(data));
        } catch (error) {
          console.error("Error fetching products:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchProducts();
    }
  }, []);

  if (loading) {
    return (
      <div className="">
        <Loader />
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="mx-auto sm:px-4 md:px-6 lg:px-0 max-w-screen-lg">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {products.length > 0 ? (
            products.map((product: ProductType) => (
              <div
                key={product.id}
                className="relative group overflow-hidden transform transition duration-300 hover:scale-105"
              >
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
}

// Wrapper Component to handle Suspense for product loading state
export default function ProductListWithSuspense() {
  return (
    <Suspense
      fallback={
        <div>
          <Loader />
        </div>
      }
    >
      <ProductList />
    </Suspense>
  );
}
