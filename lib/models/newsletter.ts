import { Model, DataTypes } from "sequelize";
import sequelize from "@/app/api/sequelize.config";

class Newsletter extends Model {
  email!: string;
  date!: Date;
}

Newsletter.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // validates email format
      },
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Newsletter",
    tableName: "newsletters",
  }
);

export default Newsletter;
