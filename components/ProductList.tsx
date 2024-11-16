// import { Suspense } from "react";

// // Fetch products function
// async function fetchProducts() {
//   const res = await fetch("http://localhost:3000/api/products");
//   if (!res.ok) {
//     throw new Error("Failed to fetch products");
//   }
//   return res.json();
// }

// // Main Products Page Component
// export default async function ProductsPage() {
//   const products = await fetchProducts();

//   return (
//     <div className="pb-6">
//       <div className="mx-auto px-4 sm:px-6 md:px-8 lg:px-0 max-w-screen-lg">
//         <h1 className="text-2xl font-bold mb-4">Products</h1>
//         <Suspense fallback={<div>Loading...</div>}>
//           <ProductList products={products} />
//         </Suspense>
//       </div>
//     </div>
//   );
// }

// // Product List Component with Styled Layout
// function ProductList({ products }: { products: any[] }) {
//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
//       {products && products.length > 0 ? (
//         products.map((product) => (
//           <div key={product.id} className="relative group overflow-hidden">
//             <ProductCard product={product} />
//           </div>
//         ))
//       ) : (
//         <p className="text-body-bold">No products found</p>
//       )}
//     </div>
//   );
// }

// // Product Card Component for Individual Product Styling
// function ProductCard({ product }: { product: any }) {
//   return (
//     <div className="border p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
//       <img
//         src={product.media[0]}
//         alt={product.title}
//         className="w-full h-48 object-cover rounded-lg mb-2"
//       />
//       <h2 className="text-lg font-semibold">{product.title}</h2>
//       <p className="text-sm text-gray-600 mb-2">{product.description}</p>
//       <span className="text-primary font-bold">${product.price}</span>
//     </div>
//   );
// }
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
        <h1 className="text-2xl font-bold mb-4">Products</h1>
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
