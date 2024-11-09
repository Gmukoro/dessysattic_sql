import React from "react";

const ProductInformation: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r from-yellow-400 via-yellow-900 to-amber-500 text-white py-4 px-8 rounded-lg shadow-lg after:content-[''] after:w-16 after:h-1 after:bg-yellow-400 after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2">
        Product Information
      </h1>
      <p>
        We strive to ensure the accuracy of our product descriptions, including
        features, specifications, and availability. However, we cannot guarantee
        that all content is error-free. Product availability is subject to
        change without notice. Should you have any specific queries regarding a
        product, feel free to
        <a href="/contact" className="text-amber-900 underline">
          contact us
        </a>
        .
      </p>
    </div>
  );
};

export default ProductInformation;
