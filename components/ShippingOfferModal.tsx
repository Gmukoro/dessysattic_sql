"use client";

import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Link from "next/link";

const ShippingOfferModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
        <button
          onClick={handleClose}
          className="absolute top-2 left-2 text-amber-700 hover:text-gray-900"
        >
          <AiOutlineClose size={24} />
        </button>
        <h2 className="text-xl text-amber-900 text-center font-bold mb-4">
          🚚 Free Shipping Alert!
        </h2>
        <p className="mb-4">
          Enjoy free shipping on orders over €150 for EU, £150 for the UK, and
          $200 for the US & Canada!
        </p>
        <div className="flex justify-center space-x-2">
          <Link href="/shop_all">
            <button className="bg-amber-700 hover:bg-amber-950 w-full text-white p-2 rounded">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShippingOfferModal;
