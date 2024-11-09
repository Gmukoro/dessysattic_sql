//app\api\products\[productId]\related\route.ts

import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";
import { NextRequest, NextResponse } from "next/server";
import sequelize from "@/app/api/sequelize.config";
import { Op } from "sequelize";

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await sequelize!.authenticate();

    // Find the main product by its ID
    const product = await Product.findByPk(params.productId, {
      include: {
        model: Collection,
        attributes: ["id"],
      },
    });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    // Find related products based on the same category or overlapping collections
    const relatedProducts = await Product.findAll({
      where: {
        [Op.or]: [
          { category: product.category },
          { collections: { [Op.in]: product.collections } },
        ],
        id: { [Op.ne]: product.id },
      },
    });

    if (relatedProducts.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No related products found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(relatedProducts, { status: 200 });
  } catch (err) {
    console.log("[related_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
