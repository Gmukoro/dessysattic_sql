// lib/models/Collection.ts

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "@/app/api/sequelize.config";

interface CollectionAttributes {
  id: number;
  title: string;
  description?: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CollectionCreationAttributes
  extends Optional<CollectionAttributes, "id"> {}

class Collection
  extends Model<CollectionAttributes, CollectionCreationAttributes>
  implements CollectionAttributes
{
  public id!: number;
  public title!: string;
  public description?: string;
  public image!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define associations here if any
  static associate(models: any) {
    Collection.hasMany(models.Product, { foreignKey: "collectionId" });
  }
}

Collection.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Collection",
    tableName: "collections",
    timestamps: true,
  }
);

export default Collection;
