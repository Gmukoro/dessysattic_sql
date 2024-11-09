import ProductDetailsMain from "@/components/ProductDetailsMain";
import ProductCard from "@/components/ProductCard";
import Reviews from "@/components/Reviews";
import { getProductDetails, getRelatedProducts } from "@/lib/actions/actions";
import { ProductType } from "@/lib/types";
import ProductInfo from "@/components/ProductInfo";

const ProductDetails = async ({
  params,
}: {
  params: { productId: string };
}) => {
  const { productId } = await params;

  const productDetails = await getProductDetails(productId);
  const relatedProducts = await getRelatedProducts(productId);

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
            {relatedProducts?.map((product: ProductType) => (
              <div className="w-full sm:w-1/2 lg:w-1/4" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
        <div className="w-full my-4">
          <Reviews productId={productId} />
        </div>
      </div>
    </>
  );
};

export const dynamic = "force-dynamic";

export default ProductDetails;
