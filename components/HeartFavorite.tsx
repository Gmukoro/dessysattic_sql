"use client";

import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./Loader";

interface HeartFavoriteProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: BaseUserDoc) => void;
}

const HeartFavorite = ({ product, updateSignedInUser }: HeartFavoriteProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Ensure the user is fetched correctly and format wishlist
  const getUser = async () => {
    if (!session || !session.user) return;

    try {
      setLoading(true);
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();

      if (data && Array.isArray(data.wishlist)) {
        setIsLiked(data.wishlist.includes(product.id));
      } else {
        console.warn("Unexpected response format:", data);
        setIsLiked(false);
      }
    } catch (err) {
      console.error("[users_GET]", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getUser();
  }, [session]);

  // Handle adding/removing product from wishlist
  const handleWishlistClick = async () => {
    if (!session?.user?.id) {
      router.push("/sign-in");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.wishlist) {
        setIsLiked(!isLiked);
        if (updateSignedInUser) {
          updateSignedInUser(data);
        }
      }
    } catch (err) {
      console.error("[wishlist_UPDATE]", err);
    } finally {
      setLoading(false);
    }
  };

  // if (loading) return <Loader />;

  return (
    <div onClick={handleWishlistClick} className="cursor-pointer">
      <Heart
        className={`text-lg ${isLiked ? "text-red-500" : "text-gray-400"}`}
      />
    </div>
  );
};

export default HeartFavorite;
