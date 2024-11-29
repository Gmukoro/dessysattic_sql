"use client";
import { useState, useEffect } from "react";
import { getAllProducts } from "@/lib/models/Product";
import { useCurrencyContext } from "@/lib/context/currencyContext";
import Image from "next/image";

const Products: React.FC = () => {
  const { selectedCurrency, convertPrice } = useCurrencyContext();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // const parsePrice = (price: any): number => {
  //   try {
  //     const parsed = JSON.parse(price);
  //     return parseFloat(parsed["$numberDecimal"]);
  //   } catch {
  //     return parseFloat(price);
  //   }
  // };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();

        // Transform product prices
        const transformedData = data.map((product: any) => ({
          ...product,
          price: product.price,
        }));

        setProducts(transformedData);
      } catch (err) {
        setError("Failed to fetch products.");
        console.error(err);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="border rounded shadow p-4">
            <h3 className="text-lg font-semibold">{product.title}</h3>
            <Image
              src={product.media[0] || product.media[1] || product.media[2]}
              alt={product.title}
              width={500}
              height={500}
              className="object-cover mb-2"
            />
            <p className="text-gray-700">{product.description}</p>
            <p className="text-xl font-bold">
              {selectedCurrency === "USD" && "$"}
              {selectedCurrency === "EUR" && "€"}
              {selectedCurrency === "CAD" && "CA$"}
              {selectedCurrency === "NGN" && "₦"}
              {selectedCurrency === "GBP" && "£"}
              {convertPrice(product.price, "EUR", selectedCurrency)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
