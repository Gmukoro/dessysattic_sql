"use client";

import { useCurrencyContext } from "@/lib/context/currencyContext";
import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";
import { useEffect, useState } from "react";
import { fallbackMedia } from "@/utils/fallbackMedia";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: BaseUserDoc) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  const { selectedCurrency, convertPrice } = useCurrencyContext();
  const [convertedPrice, setConvertedPrice] = useState<number | null>(null);

  const productMedia =
    Array.isArray(product.media) && product.media.length > 0
      ? product.media[0]
      : fallbackMedia[product.title] || "/fallback-image.jpg";

  return (
    <Link
      href={`/products/${product.id}`}
      className="w-[210px] flex flex-col gap-2"
    >
      <Image
        src={
          Array.isArray(product.media) && product.media.length > 0
            ? product.media[0]
            : "/fallback-image.jpg"
        }
        alt={product.title || "Product image"}
        width={250}
        height={300}
        className="h-[250px] rounded-lg object-cover"
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
          {convertPrice(product.price, "EUR", selectedCurrency)}
        </p>
        <HeartFavorite product={product} />
      </div>
    </Link>
  );
};

export default ProductCard;
