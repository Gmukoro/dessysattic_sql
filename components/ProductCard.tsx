

"use client";
import { useCurrencyContext } from "@/lib/context/currencyContext";
import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: BaseUserDoc) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  const { selectedCurrency, convertPrice } = useCurrencyContext();

  const parsePrice = (price: any): number => {
    try {
      const parsed = JSON.parse(price);
      return parseFloat(parsed["$numberDecimal"]);
    } catch {
      return parseFloat(price);
    }
  };

  // Parse the product price before using it
  const parsedPrice = parsePrice(product.price);

  // Determine the correct image source (fallback if needed)
  const imageSrc =
    product.media?.[0] ||
    product.media?.[1] ||
    product.media?.[2] ||
    "/images/default-product.jpg";

  return (
    <Link
      href={`/products/${product.id}`}
      className="w-[220px] flex flex-col gap-2"
    >
      <Image
        src={imageSrc}
        alt={product.title}
        width={250}
        height={300}
        className="h-[250px] rounded-lg object-cover"
        // Provide a blur-up effect while loading the image
        placeholder="blur"
        blurDataURL="/images/blur-placeholder.jpg"
      />
      <div>
        <p className="text-base-bold text-amber-900">{product.title}</p>
        <p className="text-small-medium text-grey-2">{product.category}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-small-medium font-semibold">
          {selectedCurrency === "USD" && "$"}
          {selectedCurrency === "EUR" && "€"}
          {selectedCurrency === "CAD" && "CA$"}
          {selectedCurrency === "NGN" && "₦"}
          {selectedCurrency === "GBP" && "£"}{" "}
          {convertPrice(parsedPrice, "EUR", selectedCurrency).toFixed(2)}
        </p>
        <HeartFavorite product={product} />
      </div>
    </Link>
  );
};

export default ProductCard;
