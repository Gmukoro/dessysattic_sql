import Image from "next/image";
import { NextPage } from "next";

const About: NextPage = () => {
  return (
    <div className="w-screen h-screen overflow-hidden mb-6">
      <div className="flex flex-col items-center text-center h-full">
        <div className="w-full h-full relative">
          <Image
            src="/dsy-print-unisex.jpg"
            alt="About Us"
            layout="fill"
            objectFit="cover"
            className="object-cover"
          />
        </div>

        <div className="prose max-w-3xl mt-6 mx-auto px-4">
          <h1 className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r from-yellow-600 via-yellow-900 to-amber-600 text-white py-4 px-8 rounded-lg ">
            About (us)DSY
          </h1>
          <p className="text-neutral-600">
            Welcome to DSY, where style meets innovation. Our mission is to
            blend timeless elegance with contemporary trends, creating fashion
            that inspires. Each piece in our collection is crafted with
            attention to detail and a passion for quality, ensuring you look and
            feel your best every day. At DSY, we believe fashion is more than
            just clothing—it's a statement of who you are. Explore our range and
            discover the perfect addition to your wardrobe.
          </p>
        </div>
      </div>
    </div>
  );
};
export const dynamic = "force-dynamic";

export default About;
