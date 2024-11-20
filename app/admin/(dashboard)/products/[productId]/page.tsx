"use client";

import { useEffect, useState, useCallback } from "react";
import { getProductDetails } from "@/utils/dataFetchers";
import Loader from "@/components//admincomponents/custom ui/Loader";
import ProductForm from "@/components//admincomponents/products/ProductForm";
import MainLayout from "@/components/admincomponents/MainLayout";

const ProductDetails = ({ params }: { params: { productId: string } }) => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState<ProductType | null>(
    null
  );

  const fetchProductDetails = useCallback(async () => {
    const data = await getProductDetails(params.productId);
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
