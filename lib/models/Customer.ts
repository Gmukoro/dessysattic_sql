import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "@/app/api/sequelize.config"; // Your sequelize instance
import Order from "./Order"; // Importing Order model

if (!sequelize) {
  throw new Error("Sequelize instance is not initialized.");
}

class Customer extends Model {
  id!: string;
  name!: string;
  email!: string;
  userId!: string; // Ensure you have a `userId` field if querying by it
  orders!: Order[]; // Relating to the Order model
  createdAt!: Date;
  updatedAt!: Date;

  // Method to add an order (if needed for future functionality)
  addOrder(newOrder: Order) {
    this.orders.push(newOrder); // Add the new order to the orders array
  }
}

Customer.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true, // Assuming the id is a primary key
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure `userId` is unique
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Email validation
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW, // Default to the current date
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize, // Sequelize is now guaranteed to be non-null
    modelName: "Customer",
    tableName: "customers",
    timestamps: true, // Automatically manage `createdAt` and `updatedAt`
  }
);

// Define associations
Customer.hasMany(Order, {
  foreignKey: "customerId", // Foreign key in the Order model
  as: "orders", // Alias for relationship
});
Order.belongsTo(Customer, {
  foreignKey: "customerId", // Foreign key in the Customer model
  as: "customer", // Alias for relationship
});

export default Customer;
