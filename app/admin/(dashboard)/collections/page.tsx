"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { columns } from "@/components/admincomponents/collections/CollectionColumns";
import { DataTable } from "@/components/admincomponents/custom ui/DataTable";
import { Button } from "@/components/admincomponents/ui/button";
import { Separator } from "@/components/admincomponents/ui/separator";
import Loader from "@/components/admincomponents/custom ui/Loader";
import MainLayout from "@/components/admincomponents/MainLayout";

const Collections = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch collections");
      }

      const data = await res.json();
      setCollections(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500">Error loading collections: {error}</p>;
  }

  if (collections.length === 0) {
    return <p>No collections available.</p>;
  }

  return (
    <MainLayout>
      <div className="px-10 py-5">
        <div className="flex items-center justify-between">
          <p className="text-heading2-bold">Collections</p>
          <Button
            className="bg-blue-1 text-white"
            onClick={() => router.push("/collections/new")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Collection
          </Button>
        </div>
        <Separator className="bg-grey-1 my-4" />
        <DataTable columns={columns} data={collections} searchKey="title" />
      </div>
    </MainLayout>
  );
};

export default Collections;
