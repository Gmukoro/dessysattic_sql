"use client";

import Loader from "@/components/Loader";
import ProductCard from "@/components/ProductCard";
import {
  fetchProductById,
  getUserWishlistProducts,
  ProductAttributes,
} from "@/lib/models/Product";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Wishlist = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [signedInUser, setSignedInUser] = useState<BaseUserDoc | null>(null);
  const [wishlist, setWishlist] = useState<ProductType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data
  const getUser = async () => {
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch user data.");
      const data = await res.json();
      setSignedInUser(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("[users_GET]", err.message);
        setError(err.message);
      } else {
        console.error("[users_GET]", "Unknown error occurred.");
        setError("Unknown error occurred.");
      }
    }
  };

  useEffect(() => {
    if (session?.user) {
      getUser();
    }
  }, [session]);

  // Fetch wishlist products when signedInUser is available
  const getWishlistProducts = async () => {
    setLoading(true);

    if (!signedInUser || !signedInUser.wishlist) {
      setLoading(false);
      return;
    }

    try {
      const wishlistProducts = await Promise.all(
        signedInUser.wishlist.map(async (productId) => {
          const res = await getUserWishlistProducts(parseInt(productId));
          return res;
        })
      );
    } catch (err) {
      console.error("Error fetching wishlist products:", err);
      setError("Failed to fetch wishlist products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (signedInUser) {
      getWishlistProducts();
    }
  }, [signedInUser]);

  const updateSignedInUser = (updatedUser: BaseUserDoc) => {
    setSignedInUser(updatedUser);
  };

  return (
    <div className="px-10 py-5">
      <p className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r from-yellow-500 via-yellow-900 to-amber-500 text-white py-4 px-8 rounded-lg shadow-lg">
        Your Wishlist
      </p>

      {loading && <Loader />}
      {error && <p className="text-amber-500">{error}</p>}
      {!loading && !error && wishlist.length === 0 && (
        <p>No items in your wishlist</p>
      )}

      <div className="flex flex-wrap justify-center gap-16">
        {wishlist
          .filter((product) => product !== null)
          .map((product) => (
            <ProductCard
              key={product.id}
              product={product as ProductType}
              updateSignedInUser={
                signedInUser
                  ? (updatedUser: BaseUserDoc) => setSignedInUser(updatedUser)
                  : undefined
              }
            />
          ))}
      </div>
    </div>
  );
};

export const dynamic = "force-dynamic";
export default Wishlist;
