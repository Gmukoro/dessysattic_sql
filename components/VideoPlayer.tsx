"use client";

import React, { useState } from "react";

const VideoPlayer = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(true);

  return (
    <>
      {isVideoLoaded ? (
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          preload="auto"
          onError={() => setIsVideoLoaded(false)}
        >
          <source src="/video-fashion.mp4" type="video/mp4" />
          <source src="/video-fashion.webm" type="video/webm" />
          <source
            src="https://res.cloudinary.com/dsonuae0l/video/upload/v1730193321/video-fashion_wluams.mp4"
            type="video/webm"
          />
          <img
            src="/dsy-print-unisex.jpg"
            alt="Fallback Background"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          Your browser does not support the video tag.
        </video>
      ) : (
        <img
          src="/dsy-print-unisex.jpg"
          alt="Fallback Background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      )}
    </>
  );
};

export default VideoPlayer;
