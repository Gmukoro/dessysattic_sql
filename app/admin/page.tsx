// pages/index.tsx

import SalesChart from "@/components/admincomponents/custom ui/SalesChart";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admincomponents/ui/card";
import { Separator } from "@/components/admincomponents/ui/separator";
import {
  getSalesPerMonth,
  getTotalCustomers,
  getTotalSales,
} from "@/lib/actions/actions";
import { CircleDollarSign, ShoppingBag, UserRound } from "lucide-react";
import { auth } from "@/auth";
import MainLayout from "@/components/admincomponents/MainLayout";
import { FC } from "react";

export default async function Home() {
  await auth();

  const totalRevenue = await getTotalSales().then(
    (data: { totalRevenue: any }) => data.totalRevenue
  );
  const totalOrders = await getTotalSales().then(
    (data: { totalOrders: any }) => data.totalOrders
  );
  const totalCustomers = await getTotalCustomers();

  const graphData = await getSalesPerMonth();

  return (
    <MainLayout>
      <p className="text-heading2-bold">Dashboard</p>
      <Separator className="bg-grey-1 my-5" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Revenue</CardTitle>
            <CircleDollarSign className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">€ {totalRevenue}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Orders</CardTitle>
            <ShoppingBag className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalOrders}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Total Customer</CardTitle>
            <UserRound className="max-sm:hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold">{totalCustomers}</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Sales Chart (€)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesChart data={graphData} />
        </CardContent>
      </Card>
    </MainLayout>
  );
}

export const dynamic = "force-dynamic";
