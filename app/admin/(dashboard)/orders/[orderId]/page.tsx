import { DataTable } from "@/components/admincomponents/custom ui/DataTable";
import { columns } from "@/components/admincomponents/orderItems/OrderItemsColums";
import MainLayout from "@/components/admincomponents/MainLayout";

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
  const res = await fetch(
    `${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`
  );
  const { orderDetails, customer } = await res.json();

  const { street, city, state, postalCode, country } =
    orderDetails.shippingAddress;

  return (
    <MainLayout>
      <div className="flex flex-col p-10 gap-5">
        <p className="text-base-bold">
          Order ID: <span className="text-base-medium">{orderDetails._id}</span>
        </p>
        <p className="text-base-bold">
          Customer name:{" "}
          <span className="text-base-medium">{customer.name}</span>
        </p>
        <p className="text-base-bold">
          Shipping address:{" "}
          <span className="text-base-medium">
            {street}, {city}, {state}, {postalCode}, {country}
          </span>
        </p>
        <p className="text-base-bold">
          Total Paid:{" "}
          <span className="text-base-medium">€{orderDetails.totalAmount}</span>
        </p>
        <p className="text-base-bold">
          Shipping rate ID:{" "}
          <span className="text-base-medium">{orderDetails.shippingRate}</span>
        </p>
        <DataTable
          columns={columns}
          data={orderDetails.products}
          searchKey="product"
        />
      </div>
    </MainLayout>
  );
};

export const dynamic = "force-dynamic";
export default OrderDetails;
