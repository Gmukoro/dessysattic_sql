"use client";

import { useEffect, useState } from "react";
import { getOrders } from "@/utils/dataFetchers";
import Loader from "@/components/custom ui/Loader";
import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orders/OrderColumns";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/MainLayout";

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <MainLayout>
      <div className="px-10 py-5">
        <p className="text-heading2-bold">Orders</p>
        <Separator className="bg-grey-1 my-5" />
        <DataTable columns={columns} data={orders} searchKey="_id" />
      </div>
    </MainLayout>
  );
};

export const dynamic = "force-dynamic";
export default Orders;
