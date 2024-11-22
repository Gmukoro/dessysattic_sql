"use client";

import { ColumnDef } from "@tanstack/react-table";
import Delete from "../custom ui/Delete";
import Link from "next/link";

export const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/admin/products/${row.original.id}`}
        className="hover:text-blue-1"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "collections",
    header: "Collections",
    cell: ({ row }) => {
      const collections = row.original.collections;
      return Array.isArray(collections)
        ? collections.map((collection) => collection.title).join(", ")
        : "No collections";
    },
  },
  {
    accessorKey: "price",
    header: "Price (€)",
  },
  {
    accessorKey: "expense",
    header: "Expense (€)",
  },
  {
    id: "actions",
    cell: ({ row }) => <Delete item="product" id={row.original.id} />,
  },
];
