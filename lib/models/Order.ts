import { Model, DataTypes } from "sequelize";
import sequelize from "@/app/api/sequelize.config";
import Product from "./Product";

class Order extends Model {
  [x: string]: any;
  _id!: string;
  products!: Array<{
    product: string;
    color: string;
    size: string;
    quantity: number;
  }>;
  shippingAddress!: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shippingRate!: string;
  totalAmount!: number;
  createdAt!: Date;
  customerId!: string;
}

if (!sequelize) {
  throw new Error(
    "Sequelize instance is null. Please check your sequelize configuration."
  );
}

Order.init(
  {
    _id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    products: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    shippingAddress: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    shippingRate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Order",
    tableName: "orders",
    timestamps: true,
  }
);

// Define associations
Order.belongsToMany(Product, {
  through: "OrderProducts",
  foreignKey: "orderId",
  otherKey: "productId",
  as: "products",
});

export default Order;
