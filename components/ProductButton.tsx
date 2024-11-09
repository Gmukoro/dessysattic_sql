import { ProductType } from "@/lib/types";
import Link from "next/link";

interface ProductButtonProps {
  productId: string;
  product: ProductType;
}

const ProductButton: React.FC<ProductButtonProps> = ({
  productId,
  product,
}) => {
  return (
    <Link href={`/products/${productId}`}>
      <button className="mt-2 px-4 py-2 bg-amber-950 text-neutral-200 rounded hover:bg-amber-700 transition duration-300">
        Shop
      </button>
    </Link>
  );
};

export default ProductButton;
