//app\api\search\[query]\route.ts

import { query } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { query: string } }
) => {
  try {
    const searchQuery = params.query;

    // Define the search query for MySQL
    const selectQuery = `
      SELECT * FROM products
      WHERE title LIKE ? OR category LIKE ? OR tags LIKE ?
    `;

    // Execute the query with the search term, using wildcards for LIKE query
    const products = await query({
      query: selectQuery,
      values: [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`],
    });

    // Return the products found in the search
    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.error("[search_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
