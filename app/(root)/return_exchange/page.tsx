import React from "react";

const ShippingAndReturns: React.FC = () => {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r from-yellow-400 via-yellow-900 to-amber-500 text-white py-4 px-8 rounded-lg shadow-lg after:content-[''] after:w-16 after:h-1 after:bg-yellow-400 after:absolute after:bottom-[-10px] after:left-1/2 after:transform after:-translate-x-1/2">
        Shipping and Returns
      </h1>

      <section>
        <h2 className="text-2xl font-semibold mt-4">1. Shipping Policy</h2>
        <p>
          We aim to process and ship all orders within [X] business days.
          Shipping times may vary based on your location and the shipping method
          chosen at checkout. Please note that we are not responsible for any
          delays caused by the shipping carrier or customs clearance processes.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">
          2. International Shipping
        </h2>
        <p>
          International orders may be subject to customs duties, taxes, or fees
          imposed by your country’s customs department. These charges are the
          responsibility of the recipient and are not included in the total
          price of your order.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">3. Return Policy</h2>
        <p>
          We accept returns of unworn, unused items in their original packaging
          within 14-day days of delivery for a full refund, excluding shipping
          costs. To initiate a return, please contact our customer support team
          at dessysattic2gmail.com with your order number and reason for return.
        </p>
        <p>
          Once we receive your return, please allow 14-day business days for
          processing. Refunds will be issued to the original payment method. We
          do not cover return shipping costs unless the item is defective or the
          return is due to our error.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">4. Exchanges</h2>
        <p>
          If you would like to exchange an item for a different size, color, or
          product, please initiate a return for the original item and place a
          new order. We do not offer direct exchanges at this time.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mt-4">
          5. Lost or Damaged Items
        </h2>
        <p>
          If your order arrives damaged or is lost during shipping, please
          contact us at dessysattic@gmail.com within 14-day days of receiving
          your order to resolve the issue. We will work with you to either
          replace the item or issue a refund.
        </p>
      </section>
    </div>
  );
};

export default ShippingAndReturns;
