// lib/models/passwordResetToken.ts
import { Model, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "@/app/api/sequelize.config";

class PasswordResetToken extends Model {
  token!: string;
  userId!: string;
  expires!: Date;

  // Instance method for comparing tokens
  compare(token: string): boolean {
    return bcrypt.compareSync(token, this.token);
  }
}

// Ensuring sequelize is properly initialized and not null
if (!sequelize) {
  throw new Error("Sequelize instance is not initialized.");
}

PasswordResetToken.init(
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
      },
    },
  },
  {
    sequelize,
    modelName: "PasswordResetToken",
    tableName: "password_reset_tokens",
  }
);

// Hook to hash the token before saving it
PasswordResetToken.addHook("beforeCreate", (resetToken: PasswordResetToken) => {
  if (resetToken.token) {
    resetToken.token = bcrypt.hashSync(resetToken.token, 10);
  }
});

export default PasswordResetToken;
