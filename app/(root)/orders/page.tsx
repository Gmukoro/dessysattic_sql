"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { getOrderById, getOrders } from "@/lib/models/Order";

const Orders = async () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <p className="text-body-bold my-5">Please log in to view your orders.</p>
    );
  }

  // Fetch orders by user ID (session user ID)
  const orders = await getOrders(session.user.id as string);

  if (!orders || orders.length === 0) {
    return <p className="text-body-bold my-5 ml-4">You have no orders yet.</p>;
  }

  return (
    <div className="px-10 py-5 max-sm:px-3">
      <p className="text-heading2-bold text-4xl font-bold mb-8 relative bg-gradient-to-r from-yellow-400 via-yellow-900 to-amber-500 text-white py-4 px-8 rounded-lg shadow-lg">
        Your Orders
      </p>

      <div className="flex flex-col gap-10">
        {orders.map((order: OrderType) => (
          <div className="flex flex-col gap-8 p-4 hover:bg-grey-1">
            <div className="flex gap-20 max-md:flex-col max-md:gap-3">
              <p className="text-base-bold">Order ID: {order._id}</p>
              <p className="text-base-bold">
                Total Amount: €{order.totalAmount}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {order.products.map((orderItem: OrderItemType) => (
                <div key={orderItem.product._id} className="flex gap-4">
                  {orderItem.product.media &&
                    orderItem.product.media.length > 0 && (
                      <Image
                        src={orderItem.product.media[0]}
                        alt={orderItem.product.title}
                        width={100}
                        height={100}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    )}
                  <div className="flex flex-col justify-between">
                    <p className="text-small-medium">
                      Title:{" "}
                      <span className="text-small-bold">
                        {orderItem.product.title}
                      </span>
                    </p>
                    {orderItem.color && (
                      <p className="text-small-medium">
                        Color:{" "}
                        <span className="text-small-bold">
                          {orderItem.color}
                        </span>
                      </p>
                    )}
                    {orderItem.size && (
                      <p className="text-small-medium">
                        Size:{" "}
                        <span className="text-small-bold">
                          {orderItem.size}
                        </span>
                      </p>
                    )}
                    <p className="text-small-medium">
                      Unit price:{" "}
                      <span className="text-small-bold">
                        {orderItem.product.price}
                      </span>
                    </p>
                    <p className="text-small-medium">
                      Quantity:{" "}
                      <span className="text-small-bold">
                        {orderItem.quantity}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

export const dynamic = "force-dynamic";
