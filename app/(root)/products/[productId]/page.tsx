"use client";

import { use, useEffect, useState } from "react";
import ProductDetailsMain from "@/components/ProductDetailsMain";
import ProductCard from "@/components/ProductCard";
import Reviews from "@/components/productReview";
import Loader from "@/components/Loader";

const ProductDetails = ({
  params,
}: {
  params: Promise<{ productId: string }>;
}) => {
  const { productId } = use(params);

  const [productDetails, setProductDetails] = useState<ProductType | null>(
    null
  );
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProductDetails = async () => {
      try {
        const productResponse = await fetch(`/api/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error("Product not found");
        }
        const productData = await productResponse.json();
        setProductDetails(productData);

        const relatedResponse = await fetch(
          `/api/products/${productId}/related`
        );
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedProducts(relatedData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch product details");
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (error) {
    return (
      <p className="text-heading2-bold text-4xl text-amber-900">{error}</p>
    );
  }

  if (!productDetails) {
    return (
      <div className="text-heading2-bold items-center text-4xl text-gray-700">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <ProductDetailsMain
        productMedia={productDetails.media}
        productInfo={productDetails}
      />

      <div className="flex flex-col items-center px-10 py-5 max-md:px-3">
        <div>
          <p className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r from-yellow-600 via-yellow-900 to-amber-800 text-white py-4 px-8 rounded-lg">
            Related Products
          </p>
          <div className="flex flex-wrap gap-8 mx-auto mt-8">
            {relatedProducts.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full my-4">
          {productId && <Reviews productId={productId} />}
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
