"use client";

import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface HeartFavoriteProps {
  product: ProductType;
  updateSignedInUser?: (updatedUser: BaseUserDoc) => void;
}

const HeartFavorite = ({ product, updateSignedInUser }: HeartFavoriteProps) => {
  const router = useRouter();
  const { data: session } = useSession();

  const [loading, setLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const getUser = async () => {
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
    if (session) {
      getUser();
    }
  }, [session]);

  const handleLike = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (!session) {
        router.push("/sign-in");
        return;
      }
      const res = await fetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
      });

      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Error ${res.status}: ${errorMessage}`);
      }

      const updatedUser = await res.json();
      setIsLiked(updatedUser.wishlist.includes(product.id));
      updateSignedInUser && updateSignedInUser(updatedUser);
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart fill={isLiked ? "red" : "white"} />
      {loading && <span>Loading...</span>}
    </button>
  );
};

export default HeartFavorite;
