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

  const getProducts = async () => {
    try {
      const res = await fetch("/api/products", {
        method: "GET",
      });
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.log("[products_GET]", err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <MainLayout>
      <div className="px-10 py-5">
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Products</p>
          <Button
            className="bg-blue-1 text-white"
            onClick={() => router.push("/products/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Product
          </Button>
        </div>
        <Separator className="bg-grey-1 my-4" />
        <DataTable columns={columns} data={products} searchKey="title" />
      </div>
    </MainLayout>
  );
};

export const dynamic = "force-dynamic";
export default Products;
