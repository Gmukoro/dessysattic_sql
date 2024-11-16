// components/Loading.tsx
"use client";

import React from "react";
import Image from "next/image";

const Loading: React.FC = () => (
  <div className="flex items-center justify-center h-screen">
    <Image src="/logo.png" alt="Loading..." width={100} height={100} />
  </div>
);

export default Loading;
