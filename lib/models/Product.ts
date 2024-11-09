// models/Product.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "@/app/api/sequelize.config";
import Collection from "./Collection";

class Product extends Model {
  setCollections(associatedCollections: Collection[]) {
    throw new Error("Method not implemented.");
  }
  public id!: number;
  public title!: string;
  public description!: string;
  public media!: string[];
  public category!: string;
  public collections!: Collection[];
  public tags!: string[];
  public sizes!: string[];
  public colors!: string[];
  public price!: number;
  public expense!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Product.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    media: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sizes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    colors: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    expense: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Product",
    tableName: "products",
    timestamps: true,
  }
);

// Define Many-to-Many association with Collection
Product.belongsToMany(Collection, { through: "ProductCollections" });
Collection.belongsToMany(Product, { through: "ProductCollections" });

export default Product;
