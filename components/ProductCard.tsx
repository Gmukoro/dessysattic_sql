"use client";
import { useCurrencyContext } from "@/lib/context/currencyContext";
import Image from "next/image";
import Link from "next/link";
import HeartFavorite from "./HeartFavorite";
import { BaseUserDoc, ProductType } from "@/lib/types";

interface ProductCardProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: BaseUserDoc) => void;
}

const ProductCard = ({ product, updateSignedInUser }: ProductCardProps) => {
  const { selectedCurrency, convertPrice } = useCurrencyContext();

  return (
    <Link
      href={`/products/${product._id}`}
      className="w-[220px] flex flex-col gap-2"
    >
      <Image
        src={product.media[0] || product.media[1] || product.media[2]}
        alt="product"
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
          {convertPrice(product.price, "EUR", selectedCurrency).toFixed(2)}
        </p>
        <HeartFavorite product={product} />
      </div>
    </Link>
  );
};

export default ProductCard;
