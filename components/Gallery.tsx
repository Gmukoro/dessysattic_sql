"use client";

import Image from "next/image";
import React, { useState } from "react";

const Gallery = ({ productMedia }: { productMedia?: string[] }) => {
  // Set mainImage to the first image or a placeholder if productMedia is undefined or empty
  const [mainImage, setMainImage] = useState(
    productMedia && productMedia.length > 0 ? productMedia[0] : ""
  );

  return (
    <div className="flex flex-col gap-3 max-w-[500px]">
      <Image
        src={mainImage}
        width={500}
        height={500}
        alt="Main product image"
        className="w-96 h-96 rounded-lg shadow-xl object-cover"
      />

      <div className="flex gap-2 overflow-auto tailwind-scrollbar-hide">
        {Array.isArray(productMedia) && productMedia.length > 0 ? (
          productMedia.map((image, index) => (
            <Image
              key={index}
              src={image}
              height={200}
              width={200}
              alt={`Product image ${index + 1}`}
              className={`w-20 h-20 rounded-lg object-cover cursor-pointer ${
                mainImage === image ? "border-2 border-black" : ""
              }`}
              onClick={() => setMainImage(image)}
              loading="lazy"
            />
          ))
        ) : (
          <p>No images available.</p>
        )}
      </div>
    </div>
  );
};

export default Gallery;
