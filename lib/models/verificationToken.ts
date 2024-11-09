// lib/models/verificationToken.ts

import { Model, DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "@/app/api/sequelize.config";

class VerificationToken extends Model {
  [x: string]: any;
  token!: string;
  userId!: string;
  expires!: Date;

  compare(token: string): boolean {
    return bcrypt.compareSync(token, this.token);
  }
}

VerificationToken.init(
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
    },
  },
  {
    sequelize: sequelize!, // Assert sequelize is non-null
    modelName: "VerificationToken",
    tableName: "verification_tokens",
  }
);

// Hook to hash the token before saving it
VerificationToken.addHook(
  "beforeCreate",
  (verificationToken: VerificationToken) => {
    if (verificationToken.token) {
      verificationToken.token = bcrypt.hashSync(verificationToken.token, 10);
    }
  }
);

// Adding an index to expire the document after 24 hours
VerificationToken.addHook("afterDefine", () => {
  VerificationToken.sync().then(() => {
    sequelize?.query(
      "CREATE INDEX IF NOT EXISTS expires_idx ON verification_tokens (expires)"
    );
  });
});

export default VerificationToken;
