import BestSellers from "@/components/Best_sellers";

const BestSellersPage = () => {
  return (
    <>
      <h2 className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r from-yellow-400 via-yellow-900 to-amber-500 text-white py-4 px-8 rounded-lg shadow-lg after:content-[''] after:w-16 after:h-1 after:bg-yellow-400 after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2">
        Best Sellers
      </h2>
      <BestSellers />
    </>
  );
};

export default BestSellersPage;
