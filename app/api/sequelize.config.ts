// lib/sequelize.config.ts
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let sequelize: Sequelize | null = null;

if (typeof window === "undefined") {
  sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
      host: process.env.DB_HOST as string,
      dialect: "mysql",
      logging: false,
    }
  );

  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error);
    });
}

export default sequelize;