"use client";

import { useEffect, useState, useCallback } from "react";
import { getProductDetails } from "@/utils/dataFetchers";
import Loader from "@/components/custom ui/Loader";
import ProductForm from "@/components/products/ProductForm";
import MainLayout from "@/components/MainLayout";

import { ProductType } from "@/lib/types";

const ProductDetails = ({ params }: { params: { productId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(
    null
  );

  const fetchProductDetails = useCallback(async () => {
    const data = await getProductDetails(params.productId); // Use the server-side function
    setProductDetails(data);
    setLoading(false);
  }, [params.productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  return loading ? (
    <Loader />
  ) : (
    <MainLayout>
      <ProductForm initialData={productDetails} />
    </MainLayout>
  );
};

export const dynamic = "force-dynamic";
export default ProductDetails;
