"use client";

import Gallery from "@/components/Gallery";
import ProductInfo from "@/components/ProductInfo";
import { useCurrencyContext } from "@/lib/context/currencyContext";
import { useEffect, useState } from "react";

interface ProductDetailsMainProps {
  productMedia: any;
  productInfo: ProductType;
}

const ProductDetailsMain = ({
  productMedia,
  productInfo,
}: ProductDetailsMainProps) => {
  const { selectedCurrency, convertPrice } = useCurrencyContext();
  const { price, ...restInfo } = productInfo;

  const [convertedPrice, setConvertedPrice] = useState<number>(price);
  const [currencySymbol, setCurrencySymbol] = useState<string>("");

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    CAD: "CA$",
    NGN: "₦",
    GBP: "£",
  };

  useEffect(() => {
    const parsePrice = (price: any): number => {
      try {
        const parsed = JSON.parse(price);
        return parseFloat(parsed["$numberDecimal"]);
      } catch {
        return parseFloat(price);
      }
    };

    // Parse the product price once before any use
    const parsedPrice = parsePrice(price);

    if (parsedPrice) {
      const newConvertedPrice = convertPrice(
        parsedPrice,
        "EUR",
        selectedCurrency
      ); // Use parsedPrice here
      const newCurrencySymbol = currencySymbols[selectedCurrency] || "";

      setConvertedPrice(newConvertedPrice);
      setCurrencySymbol(newCurrencySymbol);
    }
  }, [selectedCurrency, price, convertPrice]); // Remove parsedPrice from dependency array, since it's a derived value

  return (
    <div className="flex justify-center items-start gap-16 py-10 px-5 max-md:flex-col max-md:items-center">
      <Gallery productMedia={productMedia} />
      <div className="flex flex-col">
        <ProductInfo
          productInfo={{
            ...restInfo,
            price: convertedPrice,
            currencySymbol,
          }}
        />
      </div>
    </div>
  );
};

export default ProductDetailsMain;
