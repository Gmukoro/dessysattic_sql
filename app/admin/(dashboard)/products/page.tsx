"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Loader from "@/components/admincomponents/custom ui/Loader";
import { Button } from "@/components/admincomponents/ui/button";
import { Separator } from "@/components/admincomponents/ui/separator";
import { DataTable } from "@/components/admincomponents/custom ui/DataTable";
import { columns } from "@/components/admincomponents/products/ProductColumns";
import MainLayout from "@/components/admincomponents/MainLayout";

const Products = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null); // State to store error messages

  const fetchProducts = async () => {
    setLoading(true);
    setError(null); // Clear any previous error messages before fetching

    try {
      const res = await fetch("/api/products");

      // Check for any response errors
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to fetch products:", res.status, errorText);
        setError("Failed to fetch products. Please try again later.");
        throw new Error(errorText);
      }

      const rawData = await res.json(); // Parse the response as JSON directly
      console.log("API Response:", rawData); // Log it for debugging

      // Ensure rawData is an array and matches the expected format
      if (Array.isArray(rawData)) {
        setProducts(rawData); // Set the products if the response is valid
      } else {
        throw new Error("Unexpected data format received from the API");
      }
    } catch (error) {
      console.error("Error fetching or parsing products:", error);
      setError("Error fetching products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products when component mounts
  }, []); // Empty dependency array to ensure it runs only once

  return (
    <MainLayout>
      <div className="px-10 py-5">
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Products</p>
          <Button
            className="bg-gray-700 text-white"
            onClick={() => router.push("/admin/products/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Product
          </Button>
        </div>
        <Separator className="bg-grey-700 my-4" />

        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <DataTable columns={columns} data={products} searchKey="title" />
        )}
      </div>
    </MainLayout>
  );
};

export const dynamic = "force-dynamic";
export default Products;
