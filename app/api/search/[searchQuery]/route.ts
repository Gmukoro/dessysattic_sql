import { query } from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { query: string } }
) => {
  try {
    const searchQuery = `%${params.query}%`;

    // Query to search products by title, category, or tags
    const sql = `
      SELECT 
        p.id, 
        p.title, 
        p.description, 
        p.category, 
        p.price, 
        p.expense, 
        p.created_at, 
        p.updated_at 
      FROM 
        products p
      LEFT JOIN 
        product_tags pt ON p.id = pt.product_id
      LEFT JOIN 
        tags t ON pt.tag_id = t.id
      WHERE 
        p.title LIKE ? OR 
        p.category LIKE ? OR 
        t.name LIKE ?
    `;

    const searchedProducts = await query({
      query: sql,
      values: [searchQuery, searchQuery, searchQuery],
    });

    return NextResponse.json(searchedProducts, { status: 200 });
  } catch (err) {
    console.error("[search_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
