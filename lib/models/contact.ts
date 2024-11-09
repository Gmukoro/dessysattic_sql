import { Model, DataTypes } from "sequelize";
import sequelize from "@/app/api/sequelize.config";

class Contact extends Model {
  id!: number;
  name!: string;
  email!: string;
  message!: string;
  date!: Date;
}

Contact.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50], // name should be between 2 and 50 characters
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // validates the email format
      },
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Automatically sets to the current time
    },
  },
  {
    sequelize,
    modelName: "Contact",
    tableName: "contacts", // Define the table name if it differs from the model name
  }
);

export default Contact;
