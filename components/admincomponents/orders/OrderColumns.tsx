"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<OrderColumnType>[] = [
  {
    accessorKey: "id",
    header: "Order",
    cell: ({ row }) => {
      return (
        <Link
          href={`/admin/orders/${row.original.id}`}
          className="hover:text-blue-1"
        >
          {row.original.id}
        </Link>
      );
    },
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "totalAmount",
    header: "Total (€)",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
