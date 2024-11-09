"use client";

import useCart from "@/lib/hooks/useCart";
import Link from "next/link";
import { useEffect } from "react";

const SuccessfulPayment = () => {
  const cart = useCart();

  useEffect(() => {
    cart.clearCart();
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center gap-5">
      <p className="text-heading4-bold text-red-1">Successful Payment</p>
      <p>Thank you for your purchase</p>
      <Link
        href="/shop_all"
        className="p-4 border text-neutral-300 bg-amber-700 hover:bg-amber-900 hover:text-white rounded-lg"
      >
        CONTINUE TO SHOPPING
      </Link>
    </div>
  );
};

export const dynamic = "force-dynamic";

export default SuccessfulPayment;
