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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to fetch products:", res.status, errorText);
        throw new Error(errorText);
      }

      try {
        const data = await res.json(); // Try parsing JSON here
        setProducts(data);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        alert("Error fetching products. Please try again later.");
      } finally {
        setLoading(false); // Ensure loading is set to false when done
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch products on mount
  }, []); // Empty dependency array means this runs once when the component mounts

  return loading ? (
    <Loader />
  ) : (
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
        <DataTable columns={columns} data={products} searchKey="title" />
      </div>
    </MainLayout>
  );
};

export const dynamic = "force-dynamic";
export default Products;
