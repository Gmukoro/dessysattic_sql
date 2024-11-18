"use client";
import { useEffect, useState, Suspense } from "react";
import ProductCard from "./ProductCard";

// Client-side fetch to get the products
function ProductList() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:3000/api/products");
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
    }

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pb-6">
      <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-0 max-w-screen-lg">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.length > 0 ? (
            products.map((product: ProductType) => (
              <div key={product.id} className="relative group overflow-hidden">
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
    <Suspense fallback={<div>Loading products...</div>}>
      <ProductList />
    </Suspense>
  );
}
