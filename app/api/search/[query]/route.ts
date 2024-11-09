//app\api\search\[query]\route.ts

import Product from "@/lib/models/Product";
import { Op } from "sequelize";
import { NextRequest, NextResponse } from "next/server";
import sequelize from "@/app/api/sequelize.config";

export const GET = async (
  req: NextRequest,
  { params }: { params: { query: string } }
) => {
  try {
    await sequelize!.authenticate();

    const searchQuery = params.query;

    const searchedProducts = await Product.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchQuery}%` } },
          { category: { [Op.like]: `%${searchQuery}%` } },
          { tags: { [Op.like]: `%${searchQuery}%` } },
        ],
      },
    });

    return NextResponse.json(searchedProducts, { status: 200 });
  } catch (err) {
    console.log("[search_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
