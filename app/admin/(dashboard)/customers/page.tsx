import { DataTable } from "@/components/admincomponents/custom ui/DataTable";
import { columns } from "@/components/admincomponents/customers/CustomerColumns";
import { Separator } from "@/components/admincomponents/ui/separator";
import {getAllCustomers} from "@/lib/models/Customer";
import MainLayout from "@/components/admincomponents/MainLayout";

const Customers = async () => {
  const customers = await getAllCustomers({
    order: [["createdAt", "DESC"]],
  });

  return (
    <MainLayout>
      <div className="px-10 py-5">
        <p className="text-heading2-bold">Customers</p>
        <Separator className="bg-grey-1 my-5" />
        <DataTable columns={columns} data={customers} searchKey="name" />
      </div>
    </MainLayout>
  );
};

export const dynamic = "force-dynamic";

export default Customers;
